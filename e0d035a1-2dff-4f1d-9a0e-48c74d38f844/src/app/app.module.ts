import { GadgetService } from './gadget.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { InputBlockComponent } from './input-block/input-block.component';
import { StudentsBlockComponent } from './students-block/students-block.component';
import { BatchImportComponent } from './batch-import/batch-import.component';

@NgModule({
  declarations: [
    AppComponent,
    InputBlockComponent,
    StudentsBlockComponent,
    BatchImportComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
  ],
  providers: [GadgetService],
  entryComponents: [
    BatchImportComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
