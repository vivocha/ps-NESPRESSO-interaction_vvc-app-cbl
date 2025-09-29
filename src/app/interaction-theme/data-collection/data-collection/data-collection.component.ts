import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-data-collection',
  templateUrl: './data-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataCollectionComponent {

  @Input() context;
  @Output() submit = new EventEmitter();

  showFeedback = false;
  submitData(dc){
    this.submit.emit({
      dcDefinition: this.context.selectedDataCollection.dc,
      dcData: dc
    });
    if (this.context.selectedDataCollection.type === 'survey') this.showFeedback = true;
  }
}
