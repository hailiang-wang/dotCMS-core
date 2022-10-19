/**
 * 
 */
package com.dotmarketing.webdav;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.business.PermissionAPI;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotRuntimeException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.contentlet.business.HostAPI;
import com.dotmarketing.portlets.folders.model.Folder;
import com.dotmarketing.util.CompanyUtils;
import com.dotmarketing.util.Logger;
import com.dotmarketing.util.UtilMethods;
import com.liferay.portal.model.User;
import io.milton.http.Auth;
import io.milton.http.HttpManager;
import io.milton.http.LockInfo;
import io.milton.http.LockResult;
import io.milton.http.LockTimeout;
import io.milton.http.LockToken;
import io.milton.http.Request;
import io.milton.http.Request.Method;
import io.milton.http.exceptions.BadRequestException;
import io.milton.http.exceptions.ConflictException;
import io.milton.http.exceptions.NotAuthorizedException;
import io.milton.http.exceptions.PreConditionFailedException;
import io.milton.resource.CollectionResource;
import io.milton.resource.FolderResource;
import io.milton.resource.LockableResource;
import io.milton.resource.LockingCollectionResource;
import io.milton.resource.MakeCollectionableResource;
import io.milton.resource.Resource;

/**
 * @author Jason Tesser
 *
 */
public class FolderResourceImpl extends BasicFolderResourceImpl implements DotResource, LockingCollectionResource, FolderResource , MakeCollectionableResource {

	private DotWebdavHelper dotDavHelper=new DotWebdavHelper();
	private Folder folder;
	private PermissionAPI perAPI;
	private HostAPI hostAPI;
	
	public FolderResourceImpl(Folder folder, DavParams davParams) {
	    super(path);
		this.perAPI = APILocator.getPermissionAPI();
		this.folder = folder;
		this.hostAPI = APILocator.getHostAPI();
	}
	
	/* (non-Javadoc)
	 * @see io.milton.http.MakeCollectionableResource#createCollection(java.lang.String)
	 */
	public CollectionResource createCollection(String newName) throws DotRuntimeException {

	    User user=(User)HttpManager.request().getAuthorization().getTag();
		String folderPath ="";
		if(dotDavHelper.isTempResource(newName)){
			File tempFolder = dotDavHelper.getOrCreateTempFolder(path);
			return new TempFolderResourceImpl(newName,tempFolder ,isAutoPub);

		}

		try {
			Folder newfolder = dotDavHelper.createFolder(path + newName, user);
			FolderResourceImpl folderResource = new FolderResourceImpl(newfolder, path + newName + "/");
			return folderResource;
		} catch (Exception e) {
			Logger.error(this, e.getMessage(), e);
			throw new DotRuntimeException(e.getMessage(), e);
		}
	}

	/* (non-Javadoc)
	 * @see io.milton.resource.CollectionResource#child(java.lang.String)
	 */
	public Resource child(String childName) {

		if(dotDavHelper.isSameTargetAndDestinationResourceOnMove(childName)){
		   //This a small hack that prevents Milton's MoveHandler from removing the destination folder when the source and destination are the same.
		   return null;
		}

	    final User user = (User)HttpManager.request().getAuthorization().getTag();
		List<Resource> children;
		try {
			children = dotDavHelper.getChildrenOfFolder(folder, user, isAutoPub, lang);
		} catch (IOException e) {
			Logger.error(FolderResourceImpl.class, e.getMessage(), e);
			throw new DotRuntimeException(e.getMessage(), e);
		}
		for (final Resource resource : children) {
			if(resource instanceof FolderResourceImpl){
				final String name = ((FolderResourceImpl)resource).getFolder().getName();
				if(name.equalsIgnoreCase(childName)){
					return resource;
				}
			}else if(resource instanceof TempFolderResourceImpl){
				final String name = ((TempFolderResourceImpl)resource).getFolder().getName();
				if(name.equalsIgnoreCase(childName)){
					return resource;
				}
			}else if(resource instanceof TempFileResourceImpl){
				final String name = ((TempFileResourceImpl)resource).getFile().getName();
				if(name.equalsIgnoreCase(childName)){
					return resource;
				}
			}else{
				final String name = ((FileResourceImpl)resource).getFile().getFileName();
				if(name.equalsIgnoreCase(childName)){
					return resource;
				}
			}
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see io.milton.resource.CollectionResource#getChildren()
	 */
	public List<? extends Resource> getChildren() {
	    User user=(User)HttpManager.request().getAuthorization().getTag();
		List<Resource> children;
		try {
            children = dotDavHelper.getChildrenOfFolder( folder, user, isAutoPub, lang );
        } catch (IOException e) {
			Logger.error(FolderResourceImpl.class, e.getMessage(), e);
			throw new DotRuntimeException(e.getMessage(), e);
		}
		return children;
	}


	/* (non-Javadoc)
	 * @see io.milton.resource.Resource#authorise(io.milton.http.Request, io.milton.http.Request.Method, io.milton.http.Auth)
	 */
	public boolean authorise(Request req, Method method, Auth auth) {
		try {
			
			if(auth == null)
				return false;
			else {
			    User user=(User)auth.getTag();
			    if(method.isWrite){
    				return perAPI.doesUserHavePermission(folder, PermissionAPI.PERMISSION_CAN_ADD_CHILDREN, user, false);
    			}else if(!method.isWrite){
    				return perAPI.doesUserHavePermission(folder, PermissionAPI.PERMISSION_READ, user, false);
    			}
			}

		} catch (DotDataException e) {
			Logger.error(FolderResourceImpl.class, e.getMessage(),
					e);
			throw new DotRuntimeException(e.getMessage(), e);
		}
		return false;
	}

	/* (non-Javadoc)
	 * @see io.milton.resource.Resource#checkRedirect(io.milton.http.Request)
	 */
	public String checkRedirect(Request req) {
		return null;
	}

	/* (non-Javadoc)
	 * @see io.milton.resource.Resource#getContentLength()
	 */
	public Long getContentLength() {
		return (long)0;
	}

	/* (non-Javadoc)
	 * @see io.milton.resource.Resource#getContentType(java.lang.String)
	 */
	public String getContentType(String arg0) {
		return "folder";
	}

	/* (non-Javadoc)
	 * @see io.milton.resource.Resource#getModifiedDate()
	 */
	public Date getModifiedDate() {
		return folder.getIDate();
	}

	/* (non-Javadoc)
	 * @see io.milton.resource.Resource#getRealm()
	 */
	public String getRealm() {
		return CompanyUtils.getDefaultCompany().getName();
	}

	/* (non-Javadoc)
	 * @see io.milton.resource.Resource#getUniqueId()
	 */
	public String getUniqueId() {
		return folder.getInode();
	}

	/* (non-Javadoc)
	 * @see io.milton.http.DeletableResource#delete()
	 */
	public void delete() throws DotRuntimeException{
	    User user=(User)HttpManager.request().getAuthorization().getTag();
		try {
			dotDavHelper.removeObject(path, user);
		} catch (Exception e) {
			Logger.error(this, e.getMessage(), e);
			throw new DotRuntimeException(e.getMessage(), e);
		}
	}

	/* (non-Javadoc)
	 * @see io.milton.http.GetableResource#getMaxAgeSeconds()
	 */
	public Long getMaxAgeSeconds() {
		return new Long(0);
	}
	
	@Override
    public void copyTo(CollectionResource collRes, String name) throws NotAuthorizedException, BadRequestException,ConflictException {
        User user=(User)HttpManager.request().getAuthorization().getTag();
        
        if(collRes instanceof TempFolderResourceImpl){
            TempFolderResourceImpl tr = (TempFolderResourceImpl)collRes;
            try {
                dotDavHelper.copyFolderToTemp(folder, tr.getFolder(), user, name, isAutoPub, lang);
            } catch (Exception e) {
                Logger.error(this, e.getMessage(), e);
                return;
            }
        }else if(collRes instanceof FolderResourceImpl){
            FolderResourceImpl fr = (FolderResourceImpl)collRes;
            try {
                String p = fr.getPath();
                if(!p.endsWith("/"))
                    p = p + "/";
                dotDavHelper.copyFolder(path, p+name, user, isAutoPub);
            } catch (Exception e) {
                Logger.error(this, e.getMessage(), e);
            }
        }else if(collRes instanceof HostResourceImpl){
            HostResourceImpl hr = (HostResourceImpl)collRes;
            String p = path;
            if(!p.endsWith("/"))
                p = p +"/";
            try {
                dotDavHelper.copyFolder(p, "/" + hr.getName() + "/"+name, user, isAutoPub);
            } catch (Exception e) {
                Logger.error(this, e.getMessage(), e);
            }
        }
    }

	/* (non-Javadoc)
	 * @see io.milton.http.MoveableResource#moveTo(io.milton.resource.CollectionResource, java.lang.String)
	 */
	public void moveTo(CollectionResource collRes, String name) throws DotRuntimeException{
	    User user=(User)HttpManager.request().getAuthorization().getTag();
		if(collRes instanceof TempFolderResourceImpl){
			Logger.debug(this, "Webdav clients wants to move a file from dotcms to a temporary storage but we don't allow this in fear that the transaction may break and delete a file from dotcms");
			TempFolderResourceImpl tr = (TempFolderResourceImpl)collRes;
			try {
				dotDavHelper.copyFolderToTemp(folder, tr.getFolder(), user, name, isAutoPub, lang);
			} catch (IOException e) {
				Logger.error(this, e.getMessage(), e);
				return;
			}
		}else if(collRes instanceof FolderResourceImpl){
			FolderResourceImpl fr = (FolderResourceImpl)collRes;
			if(dotDavHelper.isTempResource(name)){
				Host host;
				String folderPath = "";
				try {
					host = hostAPI.find(fr.getFolder().getHostId(), user, false);
					folderPath = APILocator.getIdentifierAPI().find(fr.getFolder().getIdentifier()).getPath();
				} catch (DotDataException e) {
					Logger.error(FolderResourceImpl.class, e.getMessage(), e);
					throw new DotRuntimeException(e.getMessage(), e);
				} catch (DotSecurityException e) {
					Logger.error(FolderResourceImpl.class, e.getMessage(), e);
					throw new DotRuntimeException(e.getMessage(), e);
				}
				dotDavHelper.getOrCreateTempFolder(File.separator + host.getHostname() + folderPath + name);
				return;
			}
			try {
				String p = fr.getPath();
				if(!p.endsWith("/"))
					p = p + "/";
				dotDavHelper.move(this.getPath(), p + name, user, isAutoPub);
			} catch (Exception e) {
				Logger.error(this, e.getMessage(), e);
				throw new DotRuntimeException(e.getMessage(), e);
			}
		}else if(collRes instanceof HostResourceImpl){
			HostResourceImpl hr = (HostResourceImpl)collRes;
			if(dotDavHelper.isTempResource(name)){
				Host host = hr.getHost();
				dotDavHelper.getOrCreateTempFolder(File.separator + host.getHostname());
				return;
			}
			try {
				String p = this.getPath();
				if(!p.endsWith("/"))
					p = p +"/";
				dotDavHelper.move(p, "/" + hr.getName() + "/" + name, user, isAutoPub);
			} catch (Exception e) {
				Logger.error(this, e.getMessage(), e);
				throw new DotRuntimeException(e.getMessage(), e);
			}
		}
	}

	/* (non-Javadoc)
	 * @see io.milton.http.PropFindableResource#getCreateDate()
	 */
	public Date getCreateDate() {
		return folder.getIDate();
	}

	public String getName() {
		return UtilMethods.escapeHTMLSpecialChars(folder.getName());
	}

	public int compareTo(Object o) {
		// TODO Auto-generated method stub
		return 0;
	}

	public Folder getFolder() {
		return folder;
	}



	public LockResult lock(LockTimeout timeout, LockInfo lockInfo) {
		return dotDavHelper.lock(timeout, lockInfo, getUniqueId());
//		return dotDavHelper.lock(lockInfo, user, file.getIdentifier() + "");
	}

	public LockResult refreshLock(String token) {
		return dotDavHelper.refreshLock(getUniqueId());
//		return dotDavHelper.refreshLock(token);
	}

	public void unlock(String tokenId) {
		dotDavHelper.unlock(getUniqueId());
//		dotDavHelper.unlock(tokenId);
	}

	public LockToken getCurrentLock() {
		return dotDavHelper.getCurrentLock(getUniqueId());
	}

	public Long getMaxAgeSeconds(Auth arg0) {
		return (long)60;
	}


	public LockToken createAndLock(String name, LockTimeout timeout, LockInfo lockInfo)
			throws NotAuthorizedException {
		createCollection(name);
		return lock(timeout, lockInfo).getLockToken();
	}

    @Override
    public LockResult refreshLock(String token, LockTimeout timeout) throws NotAuthorizedException, PreConditionFailedException {
        // TODO Auto-generated method stub
        return null;
    }

}