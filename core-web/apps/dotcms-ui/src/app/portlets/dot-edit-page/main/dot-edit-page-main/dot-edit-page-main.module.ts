import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditPageMainComponent } from './dot-edit-page-main.component';
import { RouterModule } from '@angular/router';
import { DotEditPageNavModule } from '../dot-edit-page-nav/dot-edit-page-nav.module';
import { DotContentletEditorModule } from '@components/dot-contentlet-editor/dot-contentlet-editor.module';
import { DotRouterService } from '@dotcms/dotcms-js';
import { DotBlockEditorSidebarModule } from '@portlets/dot-edit-page/components/dot-block-editor-sidebar/dot-block-editor-sidebar.module';
import { DotEditPageNavDirective } from '@portlets/dot-edit-page/main/dot-edit-page-nav/directives/dot-edit-page-nav.directive';
import { DotExperimentClassDirective } from '@portlets/shared/directives/dot-experiment-class.directive';
import { DotCustomEventHandlerService } from '@dotcms/app/api/services/dot-custom-event-handler/dot-custom-event-handler.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        DotEditPageNavModule,
        DotContentletEditorModule,
        DotBlockEditorSidebarModule,
        DotEditPageNavDirective,
        DotExperimentClassDirective
    ],
    providers: [DotRouterService, DotCustomEventHandlerService],
    declarations: [DotEditPageMainComponent]
})
export class DotEditPageMainModule {}