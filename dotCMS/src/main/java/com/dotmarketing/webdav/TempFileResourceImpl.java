package com.dotmarketing.webdav;

import io.milton.http.Auth;
import io.milton.resource.CollectionResource;
import io.milton.http.FileItem;
import io.milton.resource.FileResource;
import io.milton.http.HttpManager;
import io.milton.http.LockInfo;
import io.milton.http.LockResult;
import io.milton.http.LockTimeout;
import io.milton.http.LockToken;
import io.milton.resource.LockableResource;
import io.milton.http.Range;
import io.milton.http.Request;
import io.milton.http.exceptions.NotAuthorizedException;
import io.milton.http.exceptions.PreConditionFailedException;
import io.milton.resource.Resource;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.business.PermissionAPI;
import com.dotmarketing.util.Config;
import com.dotmarketing.util.Logger;
import com.dotmarketing.util.UtilMethods;
import com.liferay.portal.model.User;
import com.liferay.util.FileUtil;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.Date;
import java.util.Map;

/**
 * 
 * @author Jason Tesser
 */
public class TempFileResourceImpl implements FileResource, DotResource {
    

	private final File file;
    private PermissionAPI perAPI; 
    private final DavParams davParams;
    public TempFileResourceImpl(DavParams davParams, File file) {
        if( file.isDirectory() ){
        	Logger.error(this, "Trying to get a temp file which is actually a directory!!!");
        	throw new IllegalArgumentException("Static resource must be a file, this is a directory: " + file.getAbsolutePath());
        }
        perAPI = APILocator.getPermissionAPI();
        this.file = file;
        this.davParams=davParams;
    }

    
    public String getUniqueId() {
        return file.hashCode() + "";
    }
    
     
    public int compareTo(Object o) {
        if( o instanceof Resource ) {
            Resource res = (Resource)o;
            return this.getName().compareTo(res.getName());
        } else {
            return -1;
        }
    }
    
    
    public void sendContent(OutputStream out, Range range, Map<String, String> params, String arg3) throws IOException {
        try(InputStream fis = Files.newInputStream(file.toPath())){
			BufferedInputStream bin = new BufferedInputStream(fis);
			final byte[] buffer = new byte[ 1024 ];
			int n = 0;
			while( -1 != (n = bin.read( buffer )) ) {
				out.write( buffer, 0, n );
			}
		}
    }

    
    public String getName() {
        return file.getName();
    }


    
    public boolean authorise(Request request, Request.Method method, Auth auth) {
    	if(auth == null)
			return false;
		else{
			return true;
		}
    }

    
    public String getRealm() {
        return null;
    }

    
    public Date getModifiedDate() {        
        Date dt = new Date(file.lastModified());
//        log.debug("static resource modified: " + dt);
        return dt;
    }

    
    public Long getContentLength() {
        return file.length();
    }

    
    public String getContentType(String accepts) {
//        String s = MimeUtil.getMimeType(file.getAbsolutePath());
//        s = MimeUtil.getPreferedMimeType(accepts,s);
//        return s;
    	
    	String mimeType = Config.CONTEXT.getMimeType(file.getName());
    	if (!UtilMethods.isSet(mimeType)) {
			mimeType = "unknown";
		}
    	
    	return mimeType;
    }


    
    public String checkRedirect(Request request) {
        return null;
    }

    
    public Long getMaxAgeSeconds() {
        return (long)60;
    }


	public void copyTo(CollectionResource collRes, String name) {
	    User user=(User)HttpManager.request().getAuthorization().getTag();
		if(collRes instanceof TempFolderResourceImpl){
			TempFolderResourceImpl tr = (TempFolderResourceImpl)collRes;
			try {
				FileUtil.copyFile(file, new File(tr.getFolder().getPath() + File.separator + name));
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
				dotDavHelper.copyTempFileToStorage(file, p + name, user, isAutoPub);
			} catch (Exception e) {
				Logger.error(this, e.getMessage(), e);
			}
		}else if(collRes instanceof LanguageFolderResourceImpl){
			LanguageFolderResourceImpl lr = (LanguageFolderResourceImpl)collRes;
			try {
				ClassLoader classLoader = getClass().getClassLoader();
				File f = new File(classLoader.getResource("content").getFile() + File.separator + name);
				if(f.exists()){
					File folder = new File(classLoader.getResource("content").getFile() + File.separator + "archived" + File.separator + f.getName());
					folder.mkdirs();
					FileUtil.copyFile(f, new File(folder.getPath() + File.separator + new Date().toString()));
				}
				FileUtil.copyFile(file, f);
			} catch (Exception e) {
				Logger.error(this, e.getMessage(), e);
				return;
			}
		}
	}


	public void delete() {
		file.delete();
	}


	public void moveTo(CollectionResource collRes, String name) {
	    User user=(User)HttpManager.request().getAuthorization().getTag();
		if(collRes instanceof TempFolderResourceImpl){
			TempFolderResourceImpl tr = (TempFolderResourceImpl)collRes;
			try {
				FileUtil.copyFile(file, new File(tr.getFolder().getPath() + File.separator + name));
				file.delete();
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
				dotDavHelper.copyTempFileToStorage(file, p + name, user, isAutoPub);
				file.delete();
			} catch (Exception e) {
				Logger.error(this, e.getMessage(), e);
			}
		}else if(collRes instanceof LanguageFolderResourceImpl){
			LanguageFolderResourceImpl lr = (LanguageFolderResourceImpl)collRes;
			try {
				ClassLoader classLoader = getClass().getClassLoader();
				File f = new File(classLoader.getResource("content").getFile() + File.separator + name);
				if(f.exists()){
					File folder = new File(classLoader.getResource("content").getFile() + File.separator + "archived" + File.separator + f.getName());
					folder.mkdirs();
					FileUtil.copyFile(f, new File(folder.getPath() + File.separator + new Date().toString() + f.getName()));
				}
				FileUtil.copyFile(file, f);
				file.delete();
			} catch (Exception e) {
				Logger.error(this, e.getMessage(), e);
				return;
			}
		}
	}


	public String processForm(Map<String, String> parameters, Map<String, FileItem> files) {
		// TODO Auto-generated method stub
		return null;
	}


	public Date getCreateDate() {
		// TODO Auto-generated method stub
		return null;
	}


	public File getFile() {
		return file;
	}



}
