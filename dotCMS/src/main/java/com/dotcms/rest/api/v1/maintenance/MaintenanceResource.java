package com.dotcms.rest.api.v1.maintenance;

import com.dotcms.concurrent.DotConcurrentFactory;
import com.dotcms.repackage.com.google.common.annotations.VisibleForTesting;
import com.dotcms.rest.InitDataObject;
import com.dotcms.rest.ResponseEntityView;
import com.dotcms.rest.WebResource;
import com.dotcms.rest.annotation.NoCache;
import com.dotcms.util.AssetExporterUtil;
import com.dotcms.util.DbExporterUtil;
import com.dotmarketing.business.ApiProvider;
import com.dotmarketing.business.Role;
import com.dotmarketing.exception.DoesNotExistException;
import com.dotmarketing.util.Config;
import com.dotmarketing.util.FileUtil;
import com.dotmarketing.util.Logger;
import com.dotmarketing.util.SecurityLogger;
import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.concurrent.TimeUnit;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.liferay.portal.model.User;
import io.vavr.control.Try;
import org.glassfish.jersey.server.JSONP;


/**
 * Maintenance (portlet) resource.
 */
@Path("/v1/maintenance")
@SuppressWarnings("serial")
public class MaintenanceResource implements Serializable {

    private final WebResource webResource;

    /**
     * Default class constructor.
     */
    public MaintenanceResource() {
        this(new WebResource(new ApiProvider()));
    }

    @VisibleForTesting
    public MaintenanceResource(WebResource webResource) {
        this.webResource = webResource;
    }

    /**
     * This method is meant to shut down the current DotCMS instance.
     * It will pass the control to catalina.sh (Tomcat) script to deal with any exit code.
     * 
     * @param request http request
     * @param response http response
     * @return string response
     */
    @DELETE
    @Path("/_shutdown")
    @JSONP
    @NoCache
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces({MediaType.APPLICATION_JSON, "application/javascript"})
    public final Response shutdown(@Context final HttpServletRequest request,
                                   @Context final HttpServletResponse response) {
        final InitDataObject initData = new WebResource.InitBuilder(webResource)
                        .requiredRoles(Role.CMS_ADMINISTRATOR_ROLE).requestAndResponse(request, response)
                        .rejectWhenNoUser(true).requiredPortlet("maintenance").init();

        Logger.info(this.getClass(), "User:" + initData.getUser() + " is shutting down dotCMS!"); 
        SecurityLogger.logInfo(this.getClass(),
                        "User:" + initData.getUser() + " is shutting down dotCMS from ip:" + request.getRemoteAddr());

        if (!Config.getBooleanProperty("ALLOW_DOTCMS_SHUTDOWN_FROM_CONSOLE", true)) {
            return Response.status(Status.FORBIDDEN).build();
        }

        DotConcurrentFactory.getInstance()
                .getSubmitter()
                .submit(
                        () -> Runtime.getRuntime().exit(0),
                        5,
                        TimeUnit.SECONDS
                );

        return Response.ok(new ResponseEntityView("Shutdown")).build();
    }

    /**
     * This method attempts to send resolved log file using an octet stream http response.
     *
     * @param request  http request
     * @param response http response
     * @param fileName name to give to file
     * @return octet stream response with file contents
     * @throws IOException
     */
    @Path("/_downloadLog/{fileName}")
    @GET
    @JSONP
    @NoCache
    @Produces({MediaType.APPLICATION_OCTET_STREAM, MediaType.APPLICATION_JSON})
    public final Response downloadLogFile(@Context final HttpServletRequest request,
            @Context final HttpServletResponse response, @PathParam("fileName") final String fileName)
            throws IOException {

        assertBackendUser(request, response);

        String tailLogFolder = Config
                .getStringProperty("TAIL_LOG_LOG_FOLDER", "./dotsecure/logs/");
        if (!tailLogFolder.endsWith(File.separator)) {
            tailLogFolder = tailLogFolder + File.separator;
        }

        final File logFile = new File(FileUtil.getAbsolutlePath(tailLogFolder + fileName));
        if(!logFile.exists()){
            throw new DoesNotExistException("Requested LogFile: " + logFile.getCanonicalPath() + " does not exist.");
        }

        Logger.info(this.getClass(), "Requested logFile: " + logFile.getCanonicalPath());

        response.setHeader( "Content-Disposition", "attachment; filename=" + fileName );
        return Response.ok(logFile, MediaType.APPLICATION_OCTET_STREAM).build();
    }

    /**
     * This method attempts to send resolved DB dump file using an octet stream http response.
     *
     * @param request  http request
     * @param response http response
     * @return octet stream response with file contents
     * @throws IOException
     */
    @Path("/_downloadDb")
    @GET
    @JSONP
    @NoCache
    @Produces({MediaType.APPLICATION_OCTET_STREAM, MediaType.APPLICATION_JSON})
    public final Response downloadDb(@Context final HttpServletRequest request,
                                     @Context final HttpServletResponse response) throws IOException {
        assertBackendUser(request, response);

        final File dbFile = DbExporterUtil.exportToFile();
        Logger.info(this.getClass(), "Requested dbFile: " + dbFile.getCanonicalPath());

        response.setHeader("Content-Disposition", "attachment; filename=" + dbFile.getName());
        return Response.ok(dbFile, MediaType.APPLICATION_OCTET_STREAM).build();
    }

    /**
     * This method attempts to send resolved DB dump file using an octet stream http response.
     *
     * @param request  http request
     * @param response http response
     * @return octet stream response with file contents
     * @throws IOException
     */
    @Path("/_assets")
    @GET
    @JSONP
    @NoCache
    @Produces({MediaType.APPLICATION_OCTET_STREAM, MediaType.APPLICATION_JSON})
    public final Response downloadAssets(@Context final HttpServletRequest request,
                                         @Context final HttpServletResponse response) throws IOException {
        final User user = Try.of(() -> assertBackendUser(request, response).getUser()).get();
        final String fileName = AssetExporterUtil.exportToFile(user, response.getOutputStream());

        response.setHeader("Content-Type", MediaType.APPLICATION_OCTET_STREAM);
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
        return Response.ok(MediaType.APPLICATION_OCTET_STREAM).build();
    }

    /**
     * Verifies that calling user is a backend user required to access the Maintenance portlet.
     *
     * @param request http request
     * @param response http response
     * @return {@link InitDataObject} instance associated to defined criteria.
     */
    private InitDataObject assertBackendUser(HttpServletRequest request, HttpServletResponse response) {
        return new WebResource.InitBuilder(webResource)
                .requiredBackendUser(true)
                .requestAndResponse(request, response)
                .rejectWhenNoUser(true)
                .requiredPortlet("maintenance")
                .init();
    }

}
