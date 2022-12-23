package com.dotmarketing.portlets.containers.business;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;

import com.dotcms.IntegrationTestBase;
import com.dotcms.datagen.ContainerDataGen;
import com.dotcms.datagen.SiteDataGen;
import com.dotcms.util.IntegrationTestInitService;
import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.business.DotStateException;
import com.dotmarketing.business.FactoryLocator;
import com.dotmarketing.business.UserAPI;
import com.dotmarketing.common.util.SQLUtilTest;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.categories.business.CategoryFactory;
import com.dotmarketing.portlets.containers.model.Container;
import com.dotmarketing.portlets.contentlet.business.HostAPI;
import com.dotmarketing.util.UUIDGenerator;
import com.google.common.collect.ImmutableMap;
import com.liferay.portal.model.User;
import java.util.Date;
import java.util.List;
import org.junit.BeforeClass;
import org.junit.Test;

public class ContainerFactoryImplTestV2 extends IntegrationTestBase {

    private static ContainerFactory containerFactory;

    private static HostAPI hostAPI;
    private static User user;
    private static UserAPI userAPI;
    private static Host host;

    @BeforeClass
    public static void prepare() throws Exception {
        // Setting web app environment
        IntegrationTestInitService.getInstance().init();

        hostAPI = APILocator.getHostAPI();
        userAPI = APILocator.getUserAPI();
        user = userAPI.getSystemUser();
        host = hostAPI.findDefaultHost(user, false);
        containerFactory = FactoryLocator.getContainerFactory();
    }

    @Test
    public void test_find_inodeInputParameter_shouldReturnContainerByInode() throws DotDataException, DotSecurityException {

        final Host daHost = new SiteDataGen().nextPersisted();

        Container newContainer =  new ContainerDataGen()
                .site(daHost)
                .title(UUIDGenerator.generateUuid())
                .nextPersisted();

        assertNotNull(newContainer);
        assertNotNull(newContainer.getInode());

        Container containerFromDB = APILocator.getContainerAPI().find(newContainer.getInode(), APILocator.systemUser(), false);

        final Container container = containerFactory.find(newContainer.getInode());

        assertNotNull(container);
        assertNotNull(container.getInode());

        APILocator.getContainerAPI().delete(container, APILocator.systemUser(), false);
        assertNull(containerFactory.find(newContainer.getInode()));
    }

    @Test
    public void test_save_containerWithoutIdentifier_shouldThrowException() throws DotDataException, DotSecurityException {

        Container container = new Container();

        container.setMaxContentlets(0);
        container.setNotes("some notes");
        container.setPreLoop("preLoop xxxx");
        container.setPostLoop("postLoop xxxx");
        container.setFriendlyName("Test container");
        container.setModDate(new Date());
        container.setModUser(user.getUserId());
        container.setOwner(user.getUserId());
        container.setTitle("Test container");
        container.setInode(UUIDGenerator.generateUuid());

        assertThrows(DotStateException.class,
                ()->{
                    containerFactory.save(container);
                });
    }

    @Test
    public void test_save_inputNewContainerData_shouldInsertNewContainer() throws DotDataException, DotSecurityException {

        final String newContainerInode = UUIDGenerator.generateUuid();
        final String newContainerIdentifier = UUIDGenerator.generateUuid();

        Container container = new Container();

        container.setMaxContentlets(0);
        container.setNotes("some notes");
        container.setPreLoop("preLoop xxxx");
        container.setPostLoop("postLoop xxxx");
        container.setFriendlyName("Test container");
        container.setModDate(new Date());
        container.setModUser(user.getUserId());
        container.setOwner(user.getUserId());
        container.setTitle("Test container");
        container.setInode(newContainerInode);
        container.setIdentifier(newContainerIdentifier);

        final Container nonExistingContainer = containerFactory.find(newContainerInode);
        assertNull(nonExistingContainer);

        containerFactory.save(container);

        final Container existingContainer = containerFactory.find(newContainerInode);
        assertNotNull(existingContainer);

        APILocator.getContainerAPI().delete(existingContainer, APILocator.systemUser(), false);
        assertNull(containerFactory.find(existingContainer.getInode()));
    }

    @Test
    public void test_save_inputExistingContainerData_shouldUpdateExistingContainer() throws DotDataException, DotSecurityException {

        final String newContainerInode = UUIDGenerator.generateUuid();
        final String newContainerIdentifier = UUIDGenerator.generateUuid();

        Container container = new Container();

        container.setMaxContentlets(0);
        container.setNotes("some notes");
        container.setPreLoop("preLoop xxxx");
        container.setPostLoop("postLoop xxxx");
        container.setFriendlyName("Test container");
        container.setModDate(new Date());
        container.setModUser(user.getUserId());
        container.setOwner(user.getUserId());
        container.setTitle("Test container");
        container.setInode(newContainerInode);
        container.setIdentifier(newContainerIdentifier);

        final Container nonExistingContainer = containerFactory.find(newContainerInode);
        assertNull(nonExistingContainer);

        containerFactory.save(container);

        Container existingContainer = containerFactory.find(newContainerInode);
        assertNotNull(existingContainer);

        existingContainer.setTitle("Updated title");
        existingContainer.setFriendlyName("Updated friendly name");

        containerFactory.save(existingContainer);

        existingContainer = containerFactory.find(newContainerInode);

        assertEquals("Updated title",existingContainer.getTitle());
        assertEquals("Updated friendly name",existingContainer.getFriendlyName());

        APILocator.getContainerAPI().delete(existingContainer, APILocator.systemUser(), false);
        assertNull(containerFactory.find(existingContainer.getInode()));
    }
}
