package com.dotmarketing.portlets.cmsmaintenance.ajax;


import com.dotcms.content.elasticsearch.business.ContentletIndexAPI;
import com.dotcms.content.elasticsearch.util.ESReindexationProcessStatus;
import com.dotcms.repackage.org.directwebremoting.WebContextFactory;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.business.CacheLocator;
import com.dotmarketing.cms.factories.PublicCompanyFactory;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotRuntimeException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.fixtask.FixTasksExecutor;
import com.dotmarketing.portlets.cmsmaintenance.factories.CMSMaintenanceFactory;
import com.dotmarketing.portlets.cmsmaintenance.util.CleanAssetsThread;
import com.dotmarketing.portlets.cmsmaintenance.util.CleanAssetsThread.BasicProcessStatus;
import com.dotmarketing.portlets.contentlet.business.ContentletAPI;
import com.dotmarketing.portlets.contentlet.model.Contentlet;
import com.dotmarketing.portlets.structure.model.Structure;
import com.dotmarketing.util.ConfigUtils;
import com.dotmarketing.util.Logger;
import com.liferay.portal.PortalException;
import com.liferay.portal.SystemException;
import com.liferay.portal.ejb.UserLocalManagerUtil;
import com.liferay.portal.language.LanguageException;
import com.liferay.portal.language.LanguageUtil;
import com.liferay.portal.model.Company;
import com.liferay.portal.model.User;
import java.io.File;
import java.sql.SQLException;
import java.text.MessageFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import javax.servlet.http.HttpServletRequest;
import org.quartz.JobExecutionContext;

/**
 * This class provides access to maintenance routines that dotCMS users can run
 * in order to keep their environments as optimized and clean as possible.
 * 
 * @author root
 * @version 1.0
 * @since Mar 22, 2012
 *
 */
public class CMSMaintenanceAjax {

    public Map getReindexationProgress() throws DotDataException {
    	validateUser();
        return ESReindexationProcessStatus.getProcessIndexationMap();
    }



    public boolean deleteIndex(String indexName){
    	validateUser();
    	return  APILocator.getContentletIndexAPI().delete(indexName);
    }


    public boolean validateUser() {
    	HttpServletRequest req = WebContextFactory.get().getHttpServletRequest();
        User user = null;
        try {
        	user = com.liferay.portal.util.PortalUtil.getUser(req);
        	if(user == null || !APILocator.getLayoutAPI().doesUserHaveAccessToPortlet("maintenance", user)){
        		throw new DotSecurityException("User does not have access to the CMS Maintance Portlet");
        	}
        	return true;
        } catch (Exception e) {
            Logger.error(this, e.getMessage());
            throw new DotRuntimeException (e.getMessage());
        }
    }


    public Map stopReindexation() throws DotDataException {
    	validateUser();
    	APILocator.getContentletIndexAPI().stopFullReindexation();
        return ESReindexationProcessStatus.getProcessIndexationMap();
    }

	/**
	 * Stops the re-indexation process and switches over to the new index data.
	 * This is useful when there only a few contents that could not be
	 * re-indexed and can be either fixed or deleted in the future.
	 * 
	 * @return A {@link Map} containing status information after switching to
	 *         the new index.
	 * @throws SQLException
	 *             An error occurred when interacting with the database.
	 * @throws DotDataException
	 *             The process to switch to the new failed.
	 * @throws InterruptedException
	 *             The established pauses to switch to the new index failed.
	 */
	public Map stopReindexationAndSwitchover() throws DotDataException, SQLException, InterruptedException {
		validateUser();
		APILocator.getContentletIndexAPI().stopFullReindexationAndSwitchover();
		return ESReindexationProcessStatus.getProcessIndexationMap();
	}

    public String cleanReindexStructure(String inode) throws DotDataException, DotSecurityException {
    	validateUser();
    	Structure structure = CacheLocator.getContentTypeCache().getStructureByInode(inode);
    	APILocator.getContentletIndexAPI().removeContentFromIndexByStructureInode(inode);
    	APILocator.getContentletAPI().refresh(structure);

    	Company d = PublicCompanyFactory.getDefaultCompany();
    	try {
			return LanguageUtil.get(d.getCompanyId(),d.getLocale(), "message.cmsmaintenance.cache.indexrebuilt");
		} catch (LanguageException e) {
			return "message.cmsmaintenance.cache.indexrebuilt";
		}
    }

    public void optimizeIndices() {
    	validateUser();
        ContentletIndexAPI api=APILocator.getContentletIndexAPI();
        List<String> indices=api.listDotCMSIndices();
        api.optimize(indices);
    }
    
    public Map<String, Integer>  flushIndiciesCache() throws InterruptedException, ExecutionException {
      validateUser();
      ContentletIndexAPI api=APILocator.getContentletIndexAPI();
      List<String> indices=api.listDotCMSIndices();
      return APILocator.getESIndexAPI().flushCaches(indices);
  }
    /**
	 * The path where tmp files are stored. This gets wiped alot
	 */
	private String backupTempFilePath = ConfigUtils.getBackupPath()+File.separator+"temp";

	private static String assetRealPath = null;
	private static String assetPath = File.separator + "assets";

    private  FixTasksExecutor fixtask=FixTasksExecutor.getInstance();

    public List <Map> fixAssetsInconsistencies() throws Exception
    {
    	validateUser();
        JobExecutionContext arg0=null;
        fixtask.execute(arg0);
		List result=fixtask.getTasksresults();
		 if(result.size()==0){
			 result=null;
		 }

        return result;

    }

    public List <Map> getFixAssetsProgress() throws Exception{
    	List result=fixtask.getTasksresults();
		 if(result.size()==0){
			 result=null;}
        return result;
    }

	/**
	 * Takes a list of comma-separated Identifiers and deletes them.
	 * 
	 * @param List
	 *            - The list of Identifiers as Strings.
	 * @param userId
	 *            - The ID of the user performing this action.
	 * @return A String array of information that provides the user with the
	 *         results of performing this action.
	 * @throws PortalException
	 *             An error occurred when retrieving the user information.
	 * @throws SystemException
	 *             A system error occurred. Please check the system logs.
	 * @throws DotDataException
	 *             An error occurred when accessing the contentlets to delete.
	 * @throws DotSecurityException
	 *             The user does not have permissions to perform this action.
	 */
	public String deleteContentletsFromIdList(String List, String userId) throws PortalException, SystemException, DotDataException,DotSecurityException {
		List<String> conditionletWithErrors = new ArrayList<>();
		validateUser();
		ContentletAPI conAPI = APILocator.getContentletAPI();
		String[] inodes = List.split(",");
		Integer contdeleted = 0;


		User user = UserLocalManagerUtil.getUserById(userId);
		for (int i = 0; i < inodes.length; i++) {
			inodes[i] = inodes[i].trim();
		}

		List<Contentlet> contentlets = new ArrayList<Contentlet>();

		for (String inode : inodes) {
			if (!inode.trim().equals("")) {
				contentlets.addAll(conAPI.getSiblings(inode));
			}
		}

		if (!contentlets.isEmpty()) {
			for (Contentlet contentlet : contentlets) {
				boolean delete = conAPI.destroy(contentlet, user, true);

				if (!delete){
					conditionletWithErrors.add(contentlet.getIdentifier());
				}else{
					contdeleted++;
				}
			}

			return getDeleteContentletMessage(user, conditionletWithErrors, contdeleted);
		}else{
			return LanguageUtil.get(user, "message.contentlet.delete.error.dontExists");
		}
	}

	private String getDeleteContentletMessage(User user, List<String> conditionletWithErrors, Integer contdeleted) throws LanguageException {
		String result = null;

		if (conditionletWithErrors.isEmpty()){
			result = LanguageUtil.get(user,"contentlets-were-succesfully-deleted");
		}else{
			String errorMessage = LanguageUtil.get(user,"message.contentlet.delete.error.archived");
			String conditionletIdentifier = conditionletWithErrors.toString().replace("[", "").replace("]", "")
							.replace(", ", ",");
			errorMessage = MessageFormat.format(errorMessage, conditionletIdentifier);

					if (contdeleted > 0){
					result = LanguageUtil.get(user, "message.contentlet.delete.success.withError");
					result = MessageFormat.format(result, errorMessage);
				}else{
					result = errorMessage;
				}
		}

		return result;
	}

	public String deletePushedAssets() throws PortalException, SystemException, DotDataException,DotSecurityException {

		String result = "success";

		try {

			APILocator.getPushedAssetsAPI().deleteAllPushedAssets();

		} catch(Exception e) {
			Logger.error(getClass(), e.getMessage(), e);
			result = "Could not delete the pushed assets. " + e.getMessage();
		}

		return result;
	}

    public int removeOldVersions(String date) throws ParseException, SQLException, DotDataException {
        	Date assetsOlderThan = new SimpleDateFormat("MM/dd/yyyy").parse(date);
        	return CMSMaintenanceFactory.deleteOldAssetVersions(assetsOlderThan);
    }

    public Map cleanAssets () throws DotDataException {

        //Create the thread to clean the assets
        CleanAssetsThread cleanAssetsThread = CleanAssetsThread.getInstance( true , true);
        BasicProcessStatus processStatus = cleanAssetsThread.getProcessStatus();
        cleanAssetsThread.start();

        //Return the initial process status
        return processStatus.buildStatusMap();
    }

    /**
     * Method to check the status of the clean assets process
     *
     * @return map with the current status information
     */
    public Map getCleanAssetsStatus () {

        //Getting the running clean assets thread
        CleanAssetsThread cleanAssetsThread = CleanAssetsThread.getInstance(false, false);
        BasicProcessStatus processStatus = cleanAssetsThread.getProcessStatus();

        //Return its current running status
        return processStatus.buildStatusMap();
    }

}
