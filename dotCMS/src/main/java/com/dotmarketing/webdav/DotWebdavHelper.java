package com.dotmarketing.webdav;

import static com.dotmarketing.business.PermissionAPI.PERMISSION_CAN_ADD_CHILDREN;
import static com.dotmarketing.business.PermissionAPI.PERMISSION_READ;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Timer;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import org.apache.velocity.runtime.resource.ResourceManager;
import com.dotcms.api.web.HttpServletRequestThreadLocal;
import com.dotcms.auth.providers.jwt.beans.JWToken;
import com.dotcms.rendering.velocity.services.DotResourceCache;
import com.dotmarketing.beans.Host;
import com.dotmarketing.beans.Identifier;
import com.dotmarketing.beans.Permission;
import com.dotmarketing.beans.WebAsset;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.business.CacheLocator;
import com.dotmarketing.business.DotStateException;
import com.dotmarketing.business.IdentifierAPI;
import com.dotmarketing.business.NoSuchUserException;
import com.dotmarketing.business.PermissionAPI;
import com.dotmarketing.business.Permissionable;
import com.dotmarketing.business.UserAPI;
import com.dotmarketing.business.Versionable;
import com.dotmarketing.cache.FolderCache;
import com.dotmarketing.cms.login.factories.LoginFactory;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotRuntimeException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.menubuilders.RefreshMenus;
import com.dotmarketing.portlets.contentlet.business.ContentletAPI;
import com.dotmarketing.portlets.contentlet.business.HostAPI;
import com.dotmarketing.portlets.contentlet.model.Contentlet;
import com.dotmarketing.portlets.contentlet.model.ContentletDependencies;
import com.dotmarketing.portlets.contentlet.model.IndexPolicy;
import com.dotmarketing.portlets.fileassets.business.FileAssetAPI;
import com.dotmarketing.portlets.fileassets.business.FileAssetSearcher;
import com.dotmarketing.portlets.fileassets.business.IFileAsset;
import com.dotmarketing.portlets.folders.business.FolderAPI;
import com.dotmarketing.portlets.folders.model.Folder;
import com.dotmarketing.portlets.languagesmanager.business.LanguageAPI;
import com.dotmarketing.portlets.structure.model.Field;
import com.dotmarketing.portlets.structure.model.Structure;
import com.dotmarketing.portlets.workflows.business.WorkflowAPI.SystemAction;
import com.dotmarketing.portlets.workflows.model.WorkflowAction;
import com.dotmarketing.util.Config;
import com.dotmarketing.util.InodeUtils;
import com.dotmarketing.util.Logger;
import com.dotmarketing.util.URLUtils;
import com.dotmarketing.util.UUIDGenerator;
import com.dotmarketing.util.UtilMethods;
import com.google.common.annotations.VisibleForTesting;
import com.liferay.portal.auth.AuthException;
import com.liferay.portal.auth.Authenticator;
import com.liferay.portal.model.Company;
import com.liferay.portal.model.User;
import com.liferay.portal.util.PropsUtil;
import com.liferay.util.FileUtil;
import io.milton.http.HttpManager;
import io.milton.http.LockInfo;
import io.milton.http.LockResult;
import io.milton.http.LockTimeout;
import io.milton.http.LockToken;
import io.milton.http.Request;
import io.milton.http.Request.Method;
import io.milton.resource.CollectionResource;
import io.milton.resource.Resource;
import io.vavr.Lazy;
import io.vavr.control.Try;

/**
 * This Helper Class provides all the utility methods needed for the interaction between dotCMS and WebDAV.
 * Web-based Distributed Authoring and Versioning, or WebDAV, is an extension of the HTTP protocol that allows you to
 * create a connection between your local computer and a server to easily transfer files between machines.
 * <p>
 * This helper has direct communication with the Workflow API used for saving, moving, and deleting pieces of content
 * in the system. </p>
 *
 * @author root
 * @since Mar 22, 2012
 */
public class DotWebdavHelper {

	private static final String PRE_AUTHENTICATOR = PropsUtil.get("auth.pipeline.pre");


	private HostAPI hostAPI = APILocator.getHostAPI();
	private FolderAPI folderAPI = APILocator.getFolderAPI();
	private IdentifierAPI identifierAPI = APILocator.getIdentifierAPI();
	private FolderCache fc = CacheLocator.getFolderCache();
	private PermissionAPI perAPI = APILocator.getPermissionAPI();
	private LanguageAPI languageAPI = APILocator.getLanguageAPI();
	private final long defaultLang = APILocator.getLanguageAPI().getDefaultLanguage().getId();
	private static final String emptyFileData = "~DOTEMPTY";
	private final ContentletAPI conAPI = APILocator.getContentletAPI();

	private final Pattern tempResourcePattern = Pattern.compile("/\\(.*\\)|/._\\(.*\\)|/\\.|^\\.|^\\(.*\\)");
	
	private final DavParams davParams;
	DotWebdavHelper(DavParams davParams) {
	    
	    this.davParams=davParams;
	}
	
	
	
	static {
		new Timer().schedule(new FileResourceCacheCleaner(), 1000  * 60 * Config.getIntProperty("WEBDAV_CLEAR_RESOURCE_CACHE_FRECUENCY", 10), 1000  * 60 * Config.getIntProperty("WEBDAV_CLEAR_RESOURCE_CACHE_FRECUENCY", 10));
	}


	public User authorizePrincipal(final String username, final String passwd) throws DotSecurityException, NoSuchUserException, DotDataException {


		final Company company         = com.dotmarketing.cms.factories.PublicCompanyFactory.getDefaultCompany();
		final boolean useEmailAsLogin = !company.getAuthType().equals(Company.AUTH_TYPE_ID);

		try {

			if (PRE_AUTHENTICATOR != null && !PRE_AUTHENTICATOR.equals("")) {

				final Authenticator authenticator = (Authenticator) new com.dotcms.repackage.bsh.
						Interpreter().eval("new " + PRE_AUTHENTICATOR + "()");
				if (useEmailAsLogin) {

					authenticator.authenticateByEmailAddress(company.getCompanyId(), username, passwd);
				} else {

					authenticator.authenticateByUserId      (company.getCompanyId(), username, passwd);
				}
			}
		} catch (AuthException ae) {

			Logger.debug(this, "Username : " + username + " failed to login", ae);
			throw new DotSecurityException(ae.getMessage(),ae);
		} catch (Exception e) {

			Logger.error(this, e.getMessage(), e);
			throw new DotSecurityException(e.getMessage(),e);
		}

		final UserAPI userAPI = APILocator.getUserAPI();
		final User user       = company.getAuthType().equals(Company.AUTH_TYPE_ID)?
				userAPI.loadUserById     (username,userAPI.getSystemUser(),false):
				userAPI.loadByUserByEmail(username, userAPI.getSystemUser(), false);

		if (user == null) {

			throw new DotSecurityException("The user was returned NULL");
		}

		// Validate password and rehash when is needed
		if (!LoginFactory.passwordMatch(passwd, user) && !this.tryMatchJsonWebToken(passwd, user)) {

			Logger.debug(this, ()-> "The user's passwords didn't match");
			throw new DotSecurityException("The user's passwords didn't match");
		}

		return user;
	}

	private boolean tryMatchJsonWebToken (final String jsonWebToken, final User user) {

		final HttpServletRequest request = HttpServletRequestThreadLocal.INSTANCE.getRequest();
		final String ipAddress           = null != request? request.getRemoteAddr(): null;
		final Optional<JWToken> tokenOpt = APILocator.getApiTokenAPI().fromJwt(jsonWebToken.trim(), ipAddress);

		return tokenOpt.isPresent() && tokenOpt.get().getUserId().equals(user.getUserId());
	}



	public IFileAsset loadFile(final DavParams params, User user) throws IOException, DotDataException, DotSecurityException{


		Identifier id = APILocator.getIdentifierAPI().find(params.host, params.path);
		if(id==null || UtilMethods.isEmpty(id.getId())) {
		    throw new DotRuntimeException("Unable to find file :" + params.host.getHostname() + params.path);
		}

		Contentlet cont = conAPI.findContentletByIdentifier(id.getId(), params.autoPub, params.languageId, user, false);
		if(cont!=null && InodeUtils.isSet(cont.getIdentifier()) && !APILocator.getVersionableAPI().isDeleted(cont)){
			return APILocator.getFileAssetAPI().fromContentlet(cont);
		}

		throw new DotRuntimeException("unable to find file:" + params);
	}

	public String getAssetName(final IFileAsset fileAsset){
		try{
			final Identifier identifier = APILocator.getIdentifierAPI().find(fileAsset.getIdentifier());
			return identifier.getAssetName();
		}catch (Exception e){
			Logger.error( DotWebdavHelper.class," Failed to obtain file-asset name ", e);
		}
		return fileAsset.getFileName();
	}

	public Folder loadFolder(User user) {

		try {
            return folderAPI.findFolderByPath(davParams.path,davParams.host, user, false);
        } catch(Exception e) {
            Logger.error( DotWebdavHelper.class," Failed to load Folder " +  davParams);
            throw new DotRuntimeException(" Failed to load Folder " + davParams);
        } 
        

	}

	public File loadTempFile(DavParams davParams){
	    String fileName = davParams.name;
	    String path =  davParams.parentPath;
	    
	    
	    
		return getOrCreateTempFile(path,fileName);
	}

	/**
	 * Returns a collection of child Resources for a given folder
	 *
	 * @param parentFolder Parent folder
	 * @param user         Authenticated user
	 * @param isAutoPub
	 * @return
	 * @throws IOException
	 */
	public List<Resource> getChildrenOfFolder ( Folder parentFolder, User user ) throws IOException {

		String prePath = "/webdav/";

		if ( davParams.autoPub ) {
			prePath += "live/";
		} else {
			prePath += "working/";
		}

		prePath += davParams.languageId;
		prePath += "/";
		

		List<Resource> result = new ArrayList<Resource>();
		try {

			//Search for child folders
			List<Folder> folderListSubChildren = folderAPI.findSubFolders( parentFolder, user, false );
			//Search for child files
			List<Versionable> filesListSubChildren = new ArrayList<Versionable>();
			try {
				filesListSubChildren.addAll( APILocator.getFileAssetAPI().findFileAssetsByDB(FileAssetSearcher.builder().folder(parentFolder).user(user).respectFrontendRoles(false).build()) );
			} catch ( Exception e2 ) {
				Logger.error( this, "Could not load files : ", e2 );
			}

			for ( Versionable file : filesListSubChildren ) {
				if ( !file.isArchived() ) {
					IFileAsset fileAsset = (IFileAsset) file;
					if(fileAsset.getLanguageId()==defaultLang){
						FileResourceImpl resource = new FileResourceImpl( fileAsset, davParams );
						result.add( resource );
					}
				}
			}
			for ( Folder folder : folderListSubChildren ) {
				String path = identifierAPI.find(folder.getIdentifier()).getPath();

				FolderResourceImpl resource = new FolderResourceImpl( folder, davParams );
				result.add( resource );
			}

			String p = APILocator.getIdentifierAPI().find(parentFolder.getIdentifier()).getPath();

			File tempDir = getOrCreateTempFolder( davParams.host.getHostname() + p.replaceAll( "/", File.separator ) );
			p = identifierAPI.find(parentFolder.getIdentifier()).getPath();
			if ( !p.endsWith( "/" ) )
				p = p + "/";
			if ( !p.startsWith( "/" ) )
				p = "/" + p;
			if ( tempDir.exists() && tempDir.isDirectory() ) {
				File[] files = tempDir.listFiles();
				for ( File file : files ) {
					String tp = prePath + davParams.host.getHostname() + p + file.getName();
					if ( !isTempResource( tp ) ) {
						continue;
					}
					if ( file.isDirectory() ) {
						TempFolderResourceImpl tr = new TempFolderResourceImpl( davParams ,file );
						result.add( tr );
					} else {
						TempFileResourceImpl tr = new TempFileResourceImpl( davParams ,file );
						result.add( tr );
					}
				}
			}
		} catch ( Exception e ) {
			Logger.error( DotWebdavHelper.class, e.getMessage(), e );
			throw new IOException( e.getMessage() );
		}

		return result;
	}

	final Lazy<File> TEMP_DIR = Lazy.of(()->{
        final File tempFile = new File(APILocator.getFileAssetAPI().getRealAssetPathTmpBinary() + File.separator + "webdav");
        tempFile.mkdirs();
        return tempFile;
	});



	public boolean isTempResource(String path){
		return tempResourcePattern.matcher(path).find();
	}

    public File getOrCreateTempFolder(String path) {
        path = path.startsWith(File.separator) ? path : File.separator + path;
        path = path.endsWith(File.separator) ? path : path + File.separator;
        final File tempDir = new File(TEMP_DIR.get() + path);
        tempDir.mkdirs();
        return tempDir;
    }

    public File getOrCreateTempFile(String path, String fileName) {
        fileName = com.dotmarketing.util.FileUtil.sanitizeFileName(fileName);
        path = path.startsWith(File.separator) ? path : File.separator + path;
        path = path.endsWith(File.separator) ? path : path + File.separator;

        
        final File tempFile = new File(TEMP_DIR.get() + path + fileName);
        tempFile.getParentFile().mkdirs();
        return tempFile;
    }
    
    
	public void copyFolderToTemp(Folder folder, File tempFolder, User user, String name,boolean isAutoPub, long lang) throws IOException{
		String p = "";
		try {
			p = identifierAPI.find(folder.getIdentifier()).getPath();
		} catch (Exception e) {
			Logger.error(DotWebdavHelper.class, e.getMessage(), e);
			throw new DotRuntimeException(e.getMessage(), e);
		}
		if(p.endsWith("/"))
			p = p + "/";
		String path = p.replace("/", File.separator);
		path = tempFolder.getPath() + File.separator + name;
		File tf = getOrCreateTempFolder(path);
		List<Resource> children = getChildrenOfFolder(folder, user);
		for (Resource resource : children) {
			if(resource instanceof CollectionResource){
				FolderResourceImpl fr = (FolderResourceImpl)resource;
				copyFolderToTemp(fr.getFolder(), tf, user, fr.getFolder().getName(),isAutoPub, lang);
			}else{
				FileResourceImpl fr = (FileResourceImpl)resource;
				copyFileToTemp(fr.getFile(), tf);
			}
		}
	}

	public File copyFileToTemp(IFileAsset file, File tempFolder) throws IOException{
		File f = null;

		f = ((Contentlet)file).getBinary(FileAssetAPI.BINARY_FIELD);

		File nf = new File(tempFolder.getPath() + File.separator + f.getName());
		FileUtil.copyFile(f, nf);
		return nf;
	}

	
	
	
	
	
	


	public void copyTempDirToStorage(File fromFileFolder, String destPath, User user,boolean autoPublish) throws Exception{
		if(fromFileFolder == null || !fromFileFolder.isDirectory()){
			throw new IOException("The temp source file must be a directory");
		}

		if(destPath.endsWith("/"))
			destPath = destPath + "/";
		createFolder(destPath, user);
		File[] files = fromFileFolder.listFiles();
		for (File file : files) {
			if(file.isDirectory()){
				copyTempDirToStorage(file, destPath + file.getName(), user, autoPublish);
			}else{
				copyTempFileToStorage(file, destPath + file.getName(), user,autoPublish);
			}
		}
	}

	public void copyTempFileToStorage(File fromFile, String destPath,User user,boolean autoPublish) throws Exception{

		if(fromFile == null){
			throw new IOException("The temp source file must exist");
		}

		writeToFile(destPath, fromFile,user, autoPublish);
	}

	public void copyResource(String fromPath, String toPath, User user, boolean autoPublish) throws Exception {
		
	    
	    writeToFile(toPath, getInputFile(fromPath,user), user, autoPublish);
	}

	public void copyFolder(String sourcePath, String destinationPath, User user, boolean autoPublish) throws IOException, DotDataException {
		try{

			PermissionAPI perAPI = APILocator.getPermissionAPI();
			createFolder(destinationPath, user);

			Summary[] children = getChildrenData(sourcePath, user);

			for (int i = children.length - 1; i >= 0; i--) {
				// children[i] = "/" + children[i];

				if (!children[i].isFolder()) {
			        File tempFile = getOrCreateTempFile(destinationPath , children[i].getName());
			        FileUtil.copyFile (getInputFile(sourcePath + "/" + children[i].getName(),user), tempFile);
				    
			        writeToFile(destinationPath + "/" + children[i].getName(), tempFile,user,autoPublish);

					// ### Copy the permission ###
					// Source
					boolean live = false;

					Identifier identifier  = APILocator.getIdentifierAPI().find(children[i].getHost(), destinationPath + "/" + children[i].getName());
					Permissionable destinationFile = null;
					if(identifier!=null && identifier.getAssetType().equals("contentlet")){
						destinationFile = conAPI.findContentletByIdentifier(identifier.getId(), live, defaultLang, user, false);
					}

					// Delete the new permissions
					perAPI.removePermissions(destinationFile);

					// Copy the new permissions
					perAPI.copyPermissions((Permissionable)children[i].getFile(), destinationFile);

					// ### END Copy the permission ###
					// }
				} else {
					copyFolder(sourcePath + "/" + children[i].getName(), destinationPath + "/" + children[i].getName(), user, autoPublish);
				}

			}

			// ### Copy the permission ###
			// Source
			String sourceHostName = getHostname(sourcePath);
			String sourceFolderName = getPath(sourcePath);
			// String sourceFolderName = DotCMSStorage.getFolderName(sourcePath);
			Host sourceHost;

			sourceHost = hostAPI.findByName(sourceHostName, user, false);



			Folder sourceFolder = folderAPI.findFolderByPath(sourceFolderName + "/", sourceHost,user,false);
			// Destination
			String destinationHostName = getHostname(destinationPath);
			String destinationFolderName = getPath(destinationPath);
			// String destinationFolderName =
			// DotCMSStorage.getFolderName(destinationPath);
			Host destinationHost;

			destinationHost = hostAPI.findByName(destinationHostName, user, false);


			Folder destinationFolder = folderAPI.findFolderByPath(destinationFolderName + "/", destinationHost,user,false);

			// Delete the new permissions
			perAPI.removePermissions(destinationFolder);

			// Copy the new permissions
			perAPI.copyPermissions(sourceFolder, destinationFolder);
		}catch (Exception e) {
			throw new DotDataException(e.getMessage(), e);
		}
		return;
	}


	public void writeToFile(String resourceUri,
								   final File fileData,  User user, boolean isAutoPub) throws Exception {

		Logger.debug(this.getClass(), "setResourceContent");
		String hostName = getHostname(resourceUri);
		String path = getPath(resourceUri);
		String folderName = getFolderName(path);
		String fileName = getFileName(path);
		fileName = deleteSpecialCharacter(fileName);
		final boolean disableWorkflow = Config.getBooleanProperty("dotcms.webdav.disableworkflow", false);

		Host host;
		try {
			host = hostAPI.findByName(hostName, user, false);
		} catch (Exception e) {
			Logger.error(DotWebdavHelper.class, e.getMessage(), e);
			throw new DotRuntimeException(e.getMessage(),e);
		}

		Folder folder = new Folder();
		try {
			folder = folderAPI.findFolderByPath(folderName, host,user,false);
		} catch (Exception e2) {
			Logger.error(this, e2.getMessage(), e2);
		}
		if (host != null && InodeUtils.isSet(host.getInode()) && InodeUtils.isSet(folder.getInode())) {
			IFileAsset destinationFile = null;
			File workingFile = null;
			Folder parent = null;
			Contentlet fileAssetCont = null;
			Identifier identifier  = APILocator.getIdentifierAPI().find(host, path);
			if(identifier!=null && InodeUtils.isSet(identifier.getId()) && identifier.getAssetType().equals("contentlet")){
				List<Contentlet> list = conAPI.findAllVersions(identifier, APILocator.getUserAPI().getSystemUser(), false);
				long langContentlet = list.get(0).getLanguageId();
				if(langContentlet != defaultLang){
					for(Contentlet c : list){
						if(c.getLanguageId() == defaultLang){
							langContentlet = defaultLang;
							break;
						}
					}
				}
				fileAssetCont = conAPI.findContentletByIdentifier(identifier.getId(), false, langContentlet, user, false);
				workingFile = fileAssetCont.getBinary(FileAssetAPI.BINARY_FIELD);
				destinationFile = APILocator.getFileAssetAPI().fromContentlet(fileAssetCont);
				parent = APILocator.getFolderAPI().findFolderByPath(identifier.getParentPath(), host, user, false);

				if(fileAssetCont.isArchived()) {
					conAPI.unarchive(fileAssetCont, user, false);
				}
			}

			//http://jira.dotmarketing.net/browse/DOTCMS-1873
			//To clear velocity cache
			if(workingFile!=null){
				DotResourceCache vc = CacheLocator.getVeloctyResourceCache();
				vc.remove(ResourceManager.RESOURCE_TEMPLATE + workingFile.getPath());
			}

			if(destinationFile==null){
				Contentlet fileAsset = new Contentlet();
				Structure faStructure = CacheLocator.getContentTypeCache().getStructureByInode(folder.getDefaultFileType());
				Field fieldVar = faStructure.getFieldVar(FileAssetAPI.BINARY_FIELD);
				fileAsset.setStructureInode(folder.getDefaultFileType());
				fileAsset.setFolder(folder.getInode());

				fileAsset.setStringProperty(FileAssetAPI.TITLE_FIELD, fileName);
				fileAsset.setStringProperty(FileAssetAPI.FILE_NAME_FIELD, fileName);
				fileAsset.setBinary(FileAssetAPI.BINARY_FIELD, fileData);
				fileAsset.setHost(host.getIdentifier());
				fileAsset.setLanguageId(defaultLang);
				fileAsset = this.runWorkflowIfPossible(resourceUri, user, isAutoPub, disableWorkflow, fileAsset);

				//Validate if the user have the right permission before
				this.validatePermissions(user, isAutoPub, disableWorkflow, fileAsset);
			} else {

				Structure faStructure = CacheLocator.getContentTypeCache().getStructureByInode(folder.getDefaultFileType());
				Field fieldVar = faStructure.getFieldVar(FileAssetAPI.BINARY_FIELD);

				fileAssetCont.setInode(null);
				fileAssetCont.setFolder(parent.getInode());
				fileAssetCont.setBinary(FileAssetAPI.BINARY_FIELD, fileData);
				fileAssetCont.setLanguageId(defaultLang);
				fileAssetCont = this.runWorkflowIfPossible(resourceUri, user, isAutoPub, disableWorkflow, fileAssetCont);

				//Wiping out the thumbnails and resized versions
				//http://jira.dotmarketing.net/browse/DOTCMS-5911
				APILocator.getFileAssetAPI().cleanThumbnailsFromFileAsset(destinationFile);

				//Wipe out empty versions that Finder creates
				final List<Contentlet> versions = conAPI.findAllVersions(identifier, user, false);
				for(final Contentlet contentlet : versions){

					final File binary = contentlet.getBinary(FileAssetAPI.BINARY_FIELD);

					Logger.debug(this, "inode " + contentlet.getInode() + " size: " + (null != binary? binary.length():0));
					if(null == binary || binary.length() == 0){
						Logger.debug(this, "deleting version " + contentlet.getInode());
						conAPI.deleteVersion(contentlet, user, false);
						break;
					}
				}
			}
		}
	} // setResourceContent.

	private void validatePermissions(User user, boolean isAutoPub, boolean disableWorkflow,
									 Contentlet fileAsset) throws DotDataException, DotSecurityException {
		if (isAutoPub && !perAPI.doesUserHavePermission(fileAsset, PermissionAPI.PERMISSION_PUBLISH, user)) {

			if (disableWorkflow) {
				fileAsset.setBoolProperty(Contentlet.DISABLE_WORKFLOW, disableWorkflow);
			}
			conAPI.archive(fileAsset, APILocator.getUserAPI().getSystemUser(), false);

			if (disableWorkflow) {
				fileAsset.setBoolProperty(Contentlet.DISABLE_WORKFLOW, disableWorkflow);
			}
			conAPI.delete(fileAsset, APILocator.getUserAPI().getSystemUser(), false);
			throw new DotSecurityException(
					"User does not have permission to publish contentlets");
		} else if (!isAutoPub && !perAPI.doesUserHavePermission(fileAsset, PermissionAPI.PERMISSION_EDIT, user)) {

			if (disableWorkflow) {
				fileAsset.setBoolProperty(Contentlet.DISABLE_WORKFLOW, disableWorkflow);
			}
			conAPI.archive(fileAsset, APILocator.getUserAPI().getSystemUser(), false);

			if (disableWorkflow) {
				fileAsset.setBoolProperty(Contentlet.DISABLE_WORKFLOW, disableWorkflow);
			}
			conAPI.delete(fileAsset, APILocator.getUserAPI().getSystemUser(), false);
			throw new DotSecurityException("User does not have permission to edit contentlets");
		}
	}


	/**
	 * Saves a File Asset that is being uploaded into dotCMS. Based on the Contentlet's data, it will be determined
	 * whether it will be processed by a Workflow or not.
	 *
	 * @param resourceUri     The location where the Resource -- i.e., File Asset -- is being saved.
	 * @param user            The user performing this action.
	 * @param isAutoPub       If {@code true}, the Resource will be published automatically. Otherwise, set to {@code
	 *                        false}.
	 * @param disableWorkflow If {@code true}, no Workflow will be executed on the specified Resource. Otherwise, set to
	 *                        {@code false}.
	 * @param fileAsset       The Resource as File Asset that is being saved.
	 *
	 * @return The {@link Contentlet} that has just been saved.
	 *
	 * @throws DotDataException     An error occurred when accessing the data source.
	 * @throws DotSecurityException The specified user doesn't have the required permissions to permiform this action.
	 */
	private Contentlet runWorkflowIfPossible(final String resourceUri, final User user, final boolean isAutoPub,
											 final boolean disableWorkflow, final Contentlet fileAsset)
			throws DotDataException, DotSecurityException {

	    // We can use defer because we use the DB to list files / folders
		fileAsset.setIndexPolicy(IndexPolicy.DEFER);
		fileAsset.setIndexPolicyDependencies(IndexPolicy.DEFER);
		fileAsset.getMap().put(Contentlet.VALIDATE_EMPTY_FILE, true);

		return disableWorkflow?
				this.runCheckinPublishNoWorkflow(resourceUri, user, isAutoPub, disableWorkflow, fileAsset):
				this.runWorkflow(resourceUri, user, isAutoPub, disableWorkflow, fileAsset);
	}

	private boolean hasPermissionPublish (final Contentlet fileAsset, final User user) throws DotDataException, DotSecurityException {

		return UtilMethods.isSet(fileAsset.getPermissionId())?
				this.perAPI.doesUserHavePermission(fileAsset, PermissionAPI.PERMISSION_PUBLISH, user):
				this.perAPI.doesUserHavePermission(fileAsset.getContentType(), PermissionAPI.PERMISSION_PUBLISH, user);
	}

	private Contentlet runWorkflow(final String resourceUri, final User user, final boolean isAutoPub,
								   final boolean disableWorkflow, Contentlet fileAsset)
			throws DotDataException, DotSecurityException {

		if (!isAutoPub) { // if it is just save

			final Optional<WorkflowAction> saveActionOpt = fileAsset.isNew()?
					APILocator.getWorkflowAPI().findActionMappedBySystemActionContentlet(fileAsset, SystemAction.NEW, user):
					APILocator.getWorkflowAPI().findActionMappedBySystemActionContentlet(fileAsset, SystemAction.EDIT, user);
			if (saveActionOpt.isPresent() && saveActionOpt.get().hasSaveActionlet()) {

				fileAsset = APILocator.getWorkflowAPI().fireContentWorkflow(fileAsset,
						new ContentletDependencies.Builder()
								.workflowActionId(saveActionOpt.get().getId())
								.modUser(user).build());


				return fileAsset;
			}
		} else if (isAutoPub && this.hasPermissionPublish(fileAsset, user)) {

			final Optional<WorkflowAction> publishActionOpt = APILocator.getWorkflowAPI().
					findActionMappedBySystemActionContentlet(fileAsset, SystemAction.PUBLISH, user);
			if (publishActionOpt.isPresent()) {

				final boolean hasSave    = publishActionOpt.get().hasSaveActionlet();
				final boolean hasPublish = publishActionOpt.get().hasPublishActionlet();

				if (hasPublish) {
					if (!hasSave) {
						// do checkin without workflow
						fileAsset.setBoolProperty(Contentlet.DISABLE_WORKFLOW, disableWorkflow);
						fileAsset = conAPI.checkin(fileAsset, user, false);
						if (fileAsset.getMap().containsKey(Contentlet.DISABLE_WORKFLOW)) {
							fileAsset.getMap().remove(Contentlet.DISABLE_WORKFLOW);
						}
					}

					fileAsset = APILocator.getWorkflowAPI().fireContentWorkflow(fileAsset,
							new ContentletDependencies.Builder()
									.workflowActionId(publishActionOpt.get().getId())
									.modUser(user).build());


					return fileAsset;
				}
			}
		}

		fileAsset = conAPI.checkin(fileAsset, user, false);
		fileAsset.getMap().put(Contentlet.VALIDATE_EMPTY_FILE, false);

		if (isAutoPub && perAPI
				.doesUserHavePermission(fileAsset, PermissionAPI.PERMISSION_PUBLISH, user)) {

			conAPI.publish(fileAsset, user,false);

		}

		return fileAsset;
	}

	private Contentlet runCheckinPublishNoWorkflow(final String resourceUri, final User user, final boolean isAutoPub,
												   final boolean disableWorkflow, Contentlet fileAsset)
			throws DotDataException, DotSecurityException {

		fileAsset.setBoolProperty(Contentlet.DISABLE_WORKFLOW, disableWorkflow);
		fileAsset = conAPI.checkin(fileAsset, user, false);
		fileAsset.getMap().put(Contentlet.VALIDATE_EMPTY_FILE, false);

		if (isAutoPub && perAPI.doesUserHavePermission(fileAsset, PermissionAPI.PERMISSION_PUBLISH, user)) {

			fileAsset.setBoolProperty(Contentlet.DISABLE_WORKFLOW, disableWorkflow);
			conAPI.publish(fileAsset, user,false);

			final Date currentDate = new Date();
		}

		return fileAsset;
	}

	/**
	 * Create temporal user folder and create a file inside of it
	 *
	 * @param fieldVar
	 * @param userId
	 * @param fileName
	 * @return created file
	 */
	private File createFileInTemporalFolder(Field fieldVar, final String userId, final String fileName) {
		final String folderPath = new StringBuilder()
				.append(APILocator.getFileAssetAPI().getRealAssetPathTmpBinary())
				.append(File.separator).append(userId).append(File.separator)
				.append(fieldVar.getFieldContentlet()).toString();

		File tempUserFolder = new File(folderPath);
		if (!tempUserFolder.exists())
			tempUserFolder.mkdirs();

		final String filePath = new StringBuilder()
				.append(tempUserFolder.getAbsolutePath())
				.append(File.separator).append(fileName).toString();

		File fileData = new File(filePath);
		if(fileData.exists())
			fileData.delete();

		return fileData;
	}

	public Folder createFolder(String folderUri, User user) throws IOException, DotDataException {
		Folder folder = null;
		PermissionAPI perAPI = APILocator.getPermissionAPI();
		Logger.debug(this.getClass(), "createFolder");
		String hostName = getHostname(folderUri);
		String path = getPath(folderUri);

		Host host;
		try {
			host = hostAPI.findByName(hostName, user, false);
		} catch (DotDataException e) {
			Logger.error(DotWebdavHelper.class, e.getMessage(), e);
			throw new IOException(e.getMessage(),e);
		} catch (DotSecurityException e) {
			Logger.error(DotWebdavHelper.class, e.getMessage(), e);
			throw new IOException(e.getMessage(),e);
		}

		// CheckPermission
		List<Permission> parentPermissions = new ArrayList<Permission>();
		boolean hasPermission = false;
		boolean validName = true;
		String parentPath = getFolderName(path);
		if (UtilMethods.isSet(parentPath) && !parentPath.equals("/")) {
			Folder parentFolder;
			try {
				parentFolder = folderAPI.findFolderByPath(parentPath,host,user,false);
				hasPermission = perAPI.doesUserHavePermission(parentFolder,	PERMISSION_CAN_ADD_CHILDREN, user, false);
			} catch (Exception e) {
				Logger.error(DotWebdavHelper.class,"Error creating folder with URI: " + folderUri + ". Error: " + e.getMessage(),e);
				throw new IOException(e.getMessage(),e);
			}
		} else {
			try {
				hasPermission = perAPI.doesUserHavePermission(host, PERMISSION_CAN_ADD_CHILDREN, user, false);
			} catch (DotDataException e) {
				Logger.error(DotWebdavHelper.class,e.getMessage(),e);
				throw new IOException(e.getMessage(),e);
			}
		}

		// Create the new folders with it parent permissions
		if ((hasPermission) && (validName)) {
			if (InodeUtils.isSet(host.getInode())) {
				path = deleteSpecialCharacter(path);
				try {
					folder = folderAPI.createFolders(path, host,user,false);
				} catch (Exception e) {
					throw new DotDataException(e.getMessage(), e);
				}
			}
		}
		return folder;
	}

    public void move(String fromPath, String toPath, User user,boolean autoPublish)throws IOException, DotDataException {
		String resourceFromPath = fromPath;
		PermissionAPI perAPI = APILocator.getPermissionAPI();
		String hostName = davParams.host.getHostname();
		String toParentPath = getFolderName(getPath(toPath));
		String fromPathStripped = fromPath;
		Host host;
		Folder toParentFolder;
		try {
			host = hostAPI.findByName(hostName, user, false);
			toParentFolder = folderAPI.findFolderByPath(toParentPath,host,user,false);
		} catch (DotDataException e) {
			Logger.error(DotWebdavHelper.class, e.getMessage(), e);
			throw new IOException(e.getMessage(),e);
		} catch (DotSecurityException e) {
			Logger.error(DotWebdavHelper.class, e.getMessage(), e);
			throw new IOException(e.getMessage(),e);
		}
		if (davParams.isFile()) {
			try {
				if (!perAPI.doesUserHavePermission(toParentFolder,
						PermissionAPI.PERMISSION_READ, user, false)) {
					throw new IOException("User doesn't have permissions to move file to folder");
				}
			} catch (DotDataException e1) {
				Logger.error(DotWebdavHelper.class,e1.getMessage(),e1);
				throw new IOException(e1.getMessage());
			}
			if (toParentFolder == null || !InodeUtils.isSet(toParentFolder.getInode())) {
				throw new IOException("Cannot move a file to the root of the host.");
			}

			try{
				final Identifier identifier  = APILocator.getIdentifierAPI().find(host, davParams.path);
				final Identifier identTo = APILocator.getIdentifierAPI().find(host, getPath(toPath));
				final boolean destinationExists = identTo != null && InodeUtils.isSet(identTo.getId());

				if(identifier!=null && identifier.getAssetType().equals("contentlet")){
					Contentlet fileAssetCont = conAPI.findContentletByIdentifier(identifier.getId(), false, defaultLang, user, false);
					if(!destinationExists) {
						if (getFolderName(fromPathStripped).equals(getFolderName(toPath))) {
							String fileName = getFileName(toPath);
							if(fileName.contains(".")){
								fileName = fileName.substring(0, fileName.lastIndexOf("."));
							}
							APILocator.getFileAssetAPI().renameFile(fileAssetCont, fileName, user, false);
						} else {
							APILocator.getFileAssetAPI().moveFile(fileAssetCont, toParentFolder, user, false);
						}
					} else {
						// if the destination exists lets just create a new version and delete the original file
						final Contentlet origin = conAPI.findContentletByIdentifier(identifier.getId(), false, defaultLang, user, false);
						final Contentlet toContentlet = conAPI.findContentletByIdentifier(identTo.getId(), false, defaultLang, user, false);
						Contentlet newVersion = conAPI.checkout(toContentlet.getInode(), user, false);

						final boolean sameSourceAndTarget = (origin.getIdentifier().equals(newVersion.getIdentifier()));

						// get a copy in a tmp folder to avoid filename change
						final File tmpDir = new File(APILocator.getFileAssetAPI().getRealAssetPathTmpBinary()
								+ File.separator+UUIDGenerator.generateUuid());
						final File tmp = new File(tmpDir, toContentlet.getBinary(FileAssetAPI.BINARY_FIELD).getName());
						FileUtil.copyFile(origin.getBinary(FileAssetAPI.BINARY_FIELD), tmp);

						newVersion.setBinary(FileAssetAPI.BINARY_FIELD, tmp);
						newVersion.setLanguageId(defaultLang);
						newVersion = conAPI.checkin(newVersion, user, false);
						if(autoPublish) {
							conAPI.publish(newVersion, user, false);
						}
						if(sameSourceAndTarget){
						   //If source and target are the same this could be a rename attempt
						   identTo.setAssetName(getFileName(toPath));
						   identifierAPI.save(identTo);
						}

						conAPI.unlock(newVersion, user, false);
						// if we don't validate source and destination are the same we will end-up loosing the file.
						if(!sameSourceAndTarget){
						  final User sysUser = APILocator.systemUser();
						  conAPI.archive(origin, sysUser, false);
						  conAPI.delete(origin, sysUser, false);
						}
					}
				}

			}catch (Exception e) {
				throw new DotDataException(e.getMessage(),e);
			}
		} else {
			if (UtilMethods.isSet(toParentPath) && !toParentPath.equals("/")) {
				try {
					if (!perAPI.doesUserHavePermission(toParentFolder,	PermissionAPI.PERMISSION_READ, user, false)) {
						throw new IOException("User doesn't have permissions to move file to folder");
					}
				} catch (DotDataException e1) {
					Logger.error(DotWebdavHelper.class,e1.getMessage(),e1);
					throw new IOException(e1.getMessage());
				}
				final boolean sourceAndDestinationAreTheSame = isSameResourcePath(fromPathStripped, toPath, user);
				if (getFolderName(fromPathStripped).equals(getFolderName(toPath))) { //This line verifies the parent folder is the same.
					Logger.debug(this, "Calling FolderFactory to rename " + fromPathStripped + " to " + toPath);

					//need to verify the source and destination are not the same because we could be renaming the folder to be the same but with different casing.
					if (!sourceAndDestinationAreTheSame) {
						try {
							// Folder must end with "/", otherwise we get the parent folder
							String folderToPath = getPath(toPath);
							if (!folderToPath.endsWith("/")) {
								folderToPath = folderToPath + "/";
							}

							final Folder folder = folderAPI
									.findFolderByPath(folderToPath, host, user, false);
							removeObject( user);
							fc.removeFolder(folder, identifierAPI.find(folder.getIdentifier()));

						} catch (Exception e) {
							Logger.debug(this, "Unable to delete toPath " + toPath);
						}
					}

					final boolean renamed;
					try{
						final Folder folder = folderAPI.findFolderByPath(getPath(fromPathStripped), host,user,false);
						renamed = folderAPI.renameFolder(folder, getFileName(toPath),user,false);
						if (!sourceAndDestinationAreTheSame) {
						    fc.removeFolder(folder, identifierAPI.find(folder.getIdentifier()));
						}
					}catch (Exception e) {
						throw new DotDataException(e.getMessage(), e);
					}
					if(!renamed){
						Logger.error(this, "Unable to rename folder");
						throw new IOException("Unable to rename folder");
					}

				} else {
					Logger.debug(this, "Calling folder factory to move from " + fromPathStripped + " to " + toParentPath);
					Folder fromFolder;
					try {
						fromFolder = folderAPI.findFolderByPath(getPath(fromPathStripped), host,user,false);
					} catch (Exception e1) {
						Logger.error(DotWebdavHelper.class, e1.getMessage(), e1);
						throw new DotRuntimeException(e1.getMessage(), e1);
					}
					if(fromFolder != null){
						Logger.debug(this,
								"Calling folder factory to move from " + identifierAPI.find(
										fromFolder.getIdentifier()).getPath() + " to "
										+ toParentPath);
						Logger.debug(this, "the from folder inode is " + fromFolder.getInode());
					}else{
						Logger.debug(this, "The from folder is null");
					}
					try {
						folderAPI.move(fromFolder, toParentFolder,user,false);
						fc.removeFolder(fromFolder, identifierAPI.find(fromFolder.getIdentifier()));
						fc.removeFolder(toParentFolder, identifierAPI.find(toParentFolder.getIdentifier()));
						//folderAPI.updateMovedFolderAssets(fromFolder);
					} catch (Exception e) {
						Logger.error(DotWebdavHelper.class, e.getMessage(), e);
						throw new DotDataException(e.getMessage(), e);
					}
				}
			} else {
				try {
					if (!perAPI.doesUserHavePermission(host,PermissionAPI.PERMISSION_READ, user, false)) {
						throw new IOException("User doesn't have permissions to move file to host");
					}
				} catch (DotDataException e) {
					Logger.error(DotWebdavHelper.class,e.getMessage(),e);
					throw new IOException(e.getMessage(),e);
				}
				if (getFolderName(fromPathStripped).equals(getFolderName(toPath))) {
					final Folder fromFolder = Try.of(()->folderAPI.findFolderByPath(getPath(fromPathStripped), host, user,false)).get();
					try{
						folderAPI.renameFolder(fromFolder, getFileName(toPath),user,false);
						fc.removeFolder(fromFolder, identifierAPI.find(fromFolder.getIdentifier()));
					}catch (Exception e) {
						if( UtilMethods.isSet(fromFolder.getName()) && fromFolder.getName().toLowerCase().contains("untitled folder")){
							try {
								folderAPI.delete(fromFolder,user,false);
							} catch (DotSecurityException ex) {
								throw new DotDataException(ex.getMessage(), ex);
							}
						}
						throw new DotDataException(e.getMessage(), e);
					}
				} else {
					final Folder fromFolder;
					try {
						fromFolder = folderAPI.findFolderByPath(getPath(fromPathStripped), host,user,false);
						folderAPI.move(fromFolder, host,user,false);
						fc.removeFolder(fromFolder, identifierAPI.find(fromFolder.getIdentifier()));
					} catch (Exception e) {
						Logger.error(DotWebdavHelper.class, e.getMessage(), e);
						throw new DotDataException(e.getMessage(), e);
					}
				}
			}
		}

	}

	public void removeObject(User user) throws IOException, DotDataException, DotSecurityException {


		Logger.debug(this.getClass(), "In the removeObject Method");



		if (davParams.isFile()) {
			Identifier identifier  = APILocator.getIdentifierAPI().find(davParams.host, davParams.path);


			Date currentDate = new Date();
			long diff = -1;
			long minTimeAllowed = Config.getIntProperty("WEBDAV_MIN_TIME_AFTER_PUBLISH_TO_ALLOW_DELETING_OF_FILES", 10);
			boolean canDelete= true;



			if(identifier!=null && identifier.getAssetType().equals("contentlet")){
				Contentlet fileAssetCont = conAPI
						.findContentletByIdentifier(identifier.getId(), false, defaultLang, user, false);

				//Webdav calls the delete method when is creating a new file. But it creates the file with 0 content length.
				//No need to wait 10 seconds with files with 0 length.
				if(canDelete
						|| (fileAssetCont.getBinary(FileAssetAPI.BINARY_FIELD) != null
						&& fileAssetCont.getBinary(FileAssetAPI.BINARY_FIELD).length() <= 0)){

					try{
						conAPI.archive(fileAssetCont, user, false);
						if (UtilMethods.isSet(fileAssetCont.getActionId())) {

							fileAssetCont.getMap().remove(Contentlet.WORKFLOW_ACTION_KEY);
						}
					}catch (Exception e) {
						Logger.error(DotWebdavHelper.class, e.getMessage(), e);
						throw new DotDataException(e.getMessage(), e);
					}


				}
			}

		} else if (davParams.isFolder()) {

		    Folder folder = folderAPI.findFolderByPath(davParams.path, davParams.host,user,false);

			if (folder.isShowOnMenu()) {
				CacheLocator.getNavToolCache().removeNav(folder.getHostId(), folder.getInode());
				if(!davParams.path.equals("/")) {
					Identifier ii=APILocator.getIdentifierAPI().find(folder.getIdentifier());
					CacheLocator.getNavToolCache().removeNavByPath(ii.getHostId(), ii.getParentPath());
				}
			}

			folderAPI.delete(folder, user,false);

		}

	}

	/**
	 * This will validate that the operation triggered is a Method `MOVE` call
	 * And extracts the source and target to compare if the source and destination
	 * @param resourceValidationName
	 * @return
	 */
	boolean isSameTargetAndDestinationResourceOnMove(final String resourceValidationName) {
		final Request request = HttpManager.request();
		if (null != request) {
			final Request.Method method = request.getMethod();
			if (Method.MOVE.equals(method)) {
				if (UtilMethods.isSet(request.getAbsoluteUrl()) && UtilMethods
						.isSet(request.getDestinationHeader())) {
					final boolean sameResource = isSameResourceURL(request.getAbsoluteUrl(),request.getDestinationHeader(), resourceValidationName);
					if (sameResource) {
						Logger.warn(DotWebdavHelper.class,
								() -> " Attempt to perform a `MOVE` operation over the same source and target resource.");
					}
					return sameResource;
				}
			}
		}
		return false;
	}




    /**
     * This takes care of situations like case sensitivity and and backslash at the end etc. Example
     * http:/demo.dotcms.com/blah/products vs http:/demo.dotcms.com/blah/Products/
     * 
     * @param sourceUrl basically url#1
     * @param targetUrl basically url#2
     * @param resourceName this ia an extra param to perform an additional validation on the
     *        resourceName
     * @return same resource returns true otherwise false.
     */
    @VisibleForTesting
    boolean isSameResourceURL(String sourceUrl, String targetUrl) {

        DavParams params1 = new DavParams(sourceUrl);
        DavParams params2 = new DavParams(targetUrl);

        return params1.equals(params2);


    }



//  Previously this was was used to store a reference to the Lock token.
//  Though the wrong inode was sent  cause the number of entries on this map to grow indefinitely. The token clean up method was broken.
//	private static Map<String, LockToken> locks = new HashMap<String, LockToken>();
//	private static LockToken currentLock;

	public final LockResult lock(LockTimeout lockTimeout, LockInfo lockInfo, String uid)
	{
		//Logger.debug("Lock : " + lockTimeout + " info : " + lockInfo + " on resource : " + getName() + " in : " + parent);
		LockToken token = new LockToken();
		token.info = lockInfo;
		token.timeout = LockTimeout.parseTimeout("30");
		token.tokenId = uid;
		// no need to save a reference
		//locks.put(uid, token);
		// But we need to return a LockResult different from null. Or it'll break.
		return LockResult.success(token);
	}

	public final LockResult refreshLock(String uid)
	{
		// log.trace("RefreshLock : " + tokenId + " on resource : " + getName() + " in : " + parent);
		LockToken token = new LockToken();
		token.info = null;
		token.timeout = LockTimeout.parseTimeout("30");
		token.tokenId = uid;
		// locks.put(uid, token);
		// Again we need to return a LockResult different from null. Or it'll break.
		return LockResult.success(token);
	}

	public void unlock(String uid)
	{
		// log.trace("UnLock : " + arg0 + " on resource : " + getName() + " in : " + parent);
		// No need to perform any clean up since we're not saving anything.
		// locks.remove(uid);
	}

	public final LockToken getCurrentLock(String uid)
	{
		// log.trace("GetCurrentLock");
		// return locks.get(uid);
		// In order to disable the lock-unlock mechanism. all we need to do is return a null instead of an existing token
		// That should trick the upper HandlerHelper.isLockedOut to believe there is no lock already installed. Therefore nothing will ever be considered to be locked again.
		return null;
	}

	private String getFileName(String uri) {
		int begin = uri.lastIndexOf("/") + 1;
		int end = uri.length();
		String fileName = uri.substring(begin, end);
		return fileName;
	}

	private String getFolderName(String uri) {
		if (uri.endsWith("/")) {
			uri = uri.substring(0, uri.length() - 1);
		}
		int begin = 0;
		int end = uri.lastIndexOf("/") + 1;
		String folderName = uri.substring(begin, end);
		return folderName;
	}

	private String getHostname(String uri) {
		if (uri == null || uri.equals("")) {
			return "/";
		}
		int begin = 1;
		int end = (uri.indexOf("/", 1) != -1 ? uri.indexOf("/", 1) : uri.length());
		uri = uri.substring(begin, end);
		return uri;
	}

	private String getPath(String uri) {
		int begin = (uri.indexOf("/", 1) != -1 ? uri.indexOf("/", 1) : uri.length());
		int end = uri.length();
		uri = uri.substring(begin, end);
		return uri;
	}

	public long getLanguage(){
		return defaultLang;
	}



	public String deleteSpecialCharacter(String fileName) throws IOException {
		return com.dotmarketing.util.FileUtil.sanitizeFileName(fileName);
	}

	private boolean checkFolderFilter(Folder folder, String fileName) {
		boolean returnValue = false;
		returnValue = folderAPI.matchFilter(folder, fileName);
		return returnValue;
	}

	private Summary[] getChildrenData(String folderUriAux, User user) throws IOException {
		PermissionAPI perAPI = APILocator.getPermissionAPI();
		Logger.debug(this.getClass(), "getChildrenNames");
		folderUriAux=stripMapping(folderUriAux);
		ArrayList<Summary> returnValue = new ArrayList<Summary>();
		try {
			// ### GET THE HOST ###
			if (folderUriAux.equals("") || folderUriAux.equals("/")) {
				List<Host> hosts = hostAPI.findAll(user, false);
				for (Host host : hosts) {
					Summary s = new Summary();
					s.setName(host.getHostname());
					s.setPath("/" + s.getName());
					s.setFolder(true);
					s.setCreateDate(host.getModDate());
					s.setModifyDate(host.getModDate());
					s.setHost(host);
					returnValue.add(s);
				}
			} else {
				// ### GET THE FOLDERS AT THE FIRST LEVEL ###
				String hostName = getHostname(folderUriAux);
				Host host;
				try {
					host = hostAPI.findByName(hostName, user, false);
				} catch (DotDataException e) {
					Logger.error(DotWebdavHelper.class, e.getMessage(), e);
					throw new IOException(e.getMessage(),e);
				} catch (DotSecurityException e) {
					Logger.error(DotWebdavHelper.class, e.getMessage(), e);
					throw new IOException(e.getMessage(),e);
				}
				String path = getPath(folderUriAux);
				if (path.equals("") || path.equals("/")) {
					List<Folder> folders = folderAPI.findSubFolders(host,user,false);
					for (Folder folderAux : folders) {
						if (perAPI.doesUserHavePermission(folderAux, PERMISSION_READ, user, false)) {
							Summary s = new Summary();
							s.setName(folderAux.getName());
							s.setPath("/" + host.getHostname()
									+ identifierAPI.find(folderAux.getIdentifier()).getPath());
							s.setPath(s.getPath().substring(0,
									s.getPath().length() - 1));
							s.setFolder(true);
							s.setCreateDate(folderAux.getIDate());
							s.setCreateDate(folderAux.getModDate());
							s.setHost(host);
							returnValue.add(s);
						}
					}
				} else {
					// ### GET THE FOLDERS, HTMLPAHES AND FILES AT SECOND LEVEL
					// AND LOWERS ###
					path += "/";
					Folder folder = folderAPI.findFolderByPath(path, host, user, false);
					if (InodeUtils.isSet(folder.getInode())) {
						List<Folder> folders = new ArrayList<>();
						List<Versionable> files = new ArrayList<>();


						try {
							folders = APILocator.getFolderAPI().findSubFolders(folder, user, false);

							final FileAssetSearcher searcher = folder.isSystemFolder() 
							                ? FileAssetSearcher.builder().host(host).user(user).respectFrontendRoles(false).build()
							                : FileAssetSearcher.builder().folder(folder).user(user).respectFrontendRoles(false).build();
							    
			
							files.addAll(APILocator.getFileAssetAPI().findFileAssetsByDB(searcher));
							
							
							
						} catch (Exception ex) {
							String message = ex.getMessage();
							Logger.debug(this, ex.toString());
						}

						for (Folder folderAux : folders) {
							if (perAPI.doesUserHavePermission(folderAux,
									PERMISSION_READ, user, false)) {
								Summary s = new Summary();
								s.setFolder(true);
								s.setCreateDate(folderAux.getIDate());
								s.setModifyDate(folderAux.getModDate());
								s.setName(folderAux.getName());
								s.setPath("/" + host.getHostname()
										+ identifierAPI.find(folderAux.getIdentifier()).getPath());
								s.setPath(s.getPath().substring(0,
										s.getPath().length() - 1));
								s.setHost(host);
								returnValue.add(s);
							}
						}

						for (Versionable file : files) {
							if (perAPI.doesUserHavePermission((Permissionable)file,
									PERMISSION_READ, user, false)) {
								IFileAsset fa = (IFileAsset)file;
								String fileUri = "";
								File workingFile = null;
								InputStream is = null;
								Date idate = null;

								Identifier identifier  = APILocator.getIdentifierAPI().find(file);
								if(identifier!=null && identifier.getAssetType().equals("contentlet")){
									fileUri = identifier.getPath();
									workingFile = ((Contentlet)file).getBinary(FileAssetAPI.BINARY_FIELD);
									is = Files.newInputStream(workingFile.toPath());
									idate = file.getModDate();
								}

								int begin = fileUri.lastIndexOf("/") + 1;
								int end = fileUri.length();
								fileUri = fileUri.substring(begin, end);
								Summary s = new Summary();
								s.setFolder(false);
								s.setName(fileUri);
								s.setPath(s.getName());
								s.setPath(folderUriAux + "/" + fileUri);
								s.setCreateDate(idate);
								s.setModifyDate(fa.getModDate());

								s.setLength(is.available());
								s.setHost(host);
								s.setFile(fa);
								returnValue.add(s);
							}
						}

					}
				}
			}
		} catch (Exception ex) {
			Logger.debug(this, ex.toString());
		}
		return returnValue.toArray(new Summary[returnValue.size()]);
	}

    private InputStream getInputStream(String resourceUri, User user) throws Exception {
        return Files.newInputStream(getInputFile(resourceUri, user).toPath());

    }

    private File getInputFile(String resourceUri, User user) throws Exception {
        resourceUri = stripMapping(resourceUri);
        String hostName = getHostname(resourceUri);
        String path = getPath(resourceUri);
        String folderName = getFolderName(path);
        Host host = hostAPI.findByName(hostName, user, false);
        Folder folder = folderAPI.findFolderByPath(folderName, host, user, false);;


        if (host != null && InodeUtils.isSet(host.getInode()) && InodeUtils.isSet(folder.getInode())) {

            Identifier identifier = APILocator.getIdentifierAPI().find(host, path);
            if (identifier != null && identifier.getAssetType().equals("contentlet")) {
                Contentlet cont = conAPI.findContentletByIdentifier(identifier.getId(), false, defaultLang, user, false);
                return cont.getBinary(FileAssetAPI.BINARY_FIELD);
            }

        }
        throw new DotRuntimeException("unable to get content for:" + resourceUri);
    }
    
    
    
}
