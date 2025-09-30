import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {DataCollectionField, MessageMetaField} from '@vivocha/public-entities/dist/data_collection';
import {phoneNumberValidator} from '../custom-validators/phone-validator';

@Component({
  selector: 'vvc-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {

  forms: {
    [id: string]: FormGroup;
  };
  fields = [];
  form: FormGroup;
  hasRequired = false;
  @Input() dc;
  @Input() country;
  @Input() readMode = false;
  @Output() submit = new EventEmitter();

  showFeedBack = false;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const controllers = {};
    let visibleElements = false;
    this.fields = this.dc.fields.filter( f => f.type !== 'meta' || f.format === 'message');
    for (const idx in this.fields) {
      const elem = this.fields[idx];
      const validators = [];
      const hasDefault = (typeof elem.defaultConstant !== 'undefined') && elem.defaultConstant != null;
      elem.value = (hasDefault && elem.type !== 'boolean') ? elem.defaultConstant.toString() : elem.defaultConstant;
      // elem.value = elem.defaultConstant;
      if ((['visitor', 'both'].indexOf(elem.hidden) === -1 && (!hasDefault || (hasDefault && elem.editIfDefault)))) {
        elem.showElement = true;
        visibleElements = true;
      }
      // validators.push(el.value || '');
      if (elem.required) {
        validators.push(Validators.required);
        this.hasRequired = true;
      }
      if (elem.minLength) {
        if (elem.type === 'string') {
          validators.push(Validators.minLength(elem.minLength));
        } else if (elem.type === 'number') {
          validators.push(Validators.min(elem.minLength));
        }
      }
      if (elem.maxLength) {
        if (elem.type === 'string') {
          validators.push(Validators.maxLength(elem.maxLength));
        } else if (elem.type === 'number') {
          validators.push(Validators.max(elem.maxLength));
        }
      }
      if (elem.validation) {
        const validation = (typeof elem.validation === 'boolean') ? elem.validation.toString() : elem.validation;
        validators.push(Validators.pattern(validation));
      }
      if (elem.format === 'phonenum' && !elem.validation) {
        if (this.country) {
          validators.push(phoneNumberValidator(this.country));
        }
        else {
          validators.push(Validators.pattern('^\\s*\\+\\s*(?:\\d\\s*){7,}$'));
        }
      }
      if (elem.format === 'email') {
        validators.push(Validators.email);
      }
      if (elem.format === 'rating') {
        elem.ratings = [];
        for (let i = elem.max || 1; i >= (elem.min || 1); i--) {
          elem.ratings.push(i);
        }
      }

      controllers[elem.id] = [(this.dc.dataValue && this.dc.dataValue[elem.id]) || elem.value || '', validators];
    }
    this.form = this.fb.group(controllers);

    if (!visibleElements) {
      this.onSubmit(new Event('submit'));
    }
  }

  getForm() {
    return this.form;
  }

  getInputElement(elem: DataCollectionField  | MessageMetaField): string {
    let element;
    switch (elem.format) {
      case 'dropdown':
        element = 'select';
        break;
      case 'checkbox':
      case 'radio':
      case 'rating':
      case 'textarea':
      case 'message':
        element = elem.format;
        break;
      default:
        element = 'input';
        break;
    }
    return element;
  }

  getInputType(elem: DataCollectionField) {
    if (['text', 'email', 'date', 'time'].indexOf(elem.format) !== -1) {
      return elem.format;
    } else if (elem.format === 'phonenum') {
      return 'text';
    } else if (elem.format === 'link') {
      return 'url';
    } else if (elem.format === 'date-time') {
      return 'datetime-local';
    } else {
      return elem.type;
    }
  }

  /**
   * Get minimum date and time based on current date and time.
   * @returns {string} - Date and time in format `YYYY-MM-DDTHH:MM`.
   */
  getMinDateTime(): string {
    const now: Date = new Date();
    let dateTime: string = now.toISOString();
        dateTime = dateTime.substring(0, dateTime.length - 8);
    return dateTime;
  }

  /**
   * Round up minutes to the nearest 10 when user changes the value of a `datetime-local` input.
   * @param {Event} event - Change event from `datetime-local` input.
   */
  onChange(event: Event) {
    let dateTimeValue: string = (event.target as HTMLInputElement).value;
        dateTimeValue = dateTimeValue.substring(dateTimeValue.length - 2);
        dateTimeValue = (Math.ceil((parseInt(dateTimeValue) + 1) / 10) * 10).toString();
        dateTimeValue = parseInt(dateTimeValue) === 60 ? '00' : dateTimeValue;
    (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.substring(0, (event.target as HTMLInputElement).value.length - 2) + dateTimeValue;
  }

  onSubmit( event ) {
    event.stopPropagation();
    this.submit.emit(this.form.value);
  }

  optionsKeys(elem) {
    return Object.keys(elem);
  }
}
