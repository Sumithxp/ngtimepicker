import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

export const CONFIG = {
  HOUR_TOKENS: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
  MINUTE_TOKENS: ['mm', 'm'],
  SECOND_TOKENS: ['ss', 's'],
  APM_TOKENS: ['A', 'a']
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngTimePicker';

  @Input() value: any = {};
  @Input() hideClearButton: boolean;
  @Input() format = 'HH:mm';
  apm: any;
  private _minuteInterval = 1;
  @Input()
  set minuteInterval(value: number) {
    if (value < 0) {
      throw new Error('minute-interval must be greater than 0');
    } else {
      this._minuteInterval = value;
    }
  }
  get minuteInterval(): number {
    return this._minuteInterval;
  }

  private _secondInterval = 1;
  @Input()
  set secondInterval(value: number) {
    if (value < 0) {
      throw new Error('second-interval must be greater than 0');
    } else {
      this._secondInterval = value;
    }
  }
  get secondInterval(): number {
    return this._secondInterval;
  }

  @Input() disabled: boolean;

  @Input() disabledValues = { hour: [], minute: [], second: [], apm: [] };

  private showDropdown = false;

  @Output() timeChange: EventEmitter<any> = new EventEmitter<any>();

  get displayTime() {
    let formatString = this.format;
    if (this.value[this.hourType]) {
      formatString = formatString.replace(new RegExp(this.hourType, 'g'), this.value[this.hourType]);
    }
    if (this.value[this.minuteType]) {
      formatString = formatString.replace(new RegExp(this.minuteType, 'g'), this.value[this.minuteType]);
    }
    if (this.value[this.secondType] && this.secondType) {
      formatString = formatString.replace(new RegExp(this.secondType, 'g'), this.value[this.secondType]);
    }
    if (this.value[this.apmType] && this.apmType) {
      formatString = formatString.replace(new RegExp(this.apmType, 'g'), this.value[this.apmType]);
    }
    return formatString;
  }

  get showClearBtn() {
    return !!this.value[this.hourType] || !!this.value[this.minuteType];
  }

  get hourType() {
    return this.checkAcceptingType(CONFIG.HOUR_TOKENS, this.format, 'HH');
  }
  get minuteType() {
    return this.checkAcceptingType(CONFIG.MINUTE_TOKENS, this.format, 'mm');
  }
  get secondType() {
    return this.checkAcceptingType(CONFIG.SECOND_TOKENS, this.format);
  }
  get apmType() {
    return this.checkAcceptingType(CONFIG.APM_TOKENS, this.format);
  }
  get hours() {
    const hoursCount = this.isTwelveHours ? 12 : 24;
    const hours = [];
    for (let i = 0; i < hoursCount; i++) {
      switch (this.hourType) {
        case 'H':
          hours.push(String(i));
          break;
        case 'HH':
          hours.push(('0' + i).substr(-2, 2));
          break;
        case 'h':
        case 'k':
          hours.push(String(i + 1));
          break;
        case 'hh':
        case 'kk':
          hours.push(('0' + String(i + 1)).substr(-2, 2));
          break;
      }
    }
    return hours;
  }

  get minutes() {
    const minutes = [];
    for (let i = 0; i < 60; i += this.minuteInterval) {
      switch (this.minuteType) {
        case 'm':
          minutes.push(String(i));
          break;
        case 'mm':
          minutes.push(('0' + i).substr(-2, 2));
          break;
      }
    }
    return minutes;
  }
  get seconds() {
    const seconds = [];
    for (let i = 0; i < 60; i += this.secondInterval) {
      switch (this.secondType) {
        case 's':
          seconds.push(i);
          break;
        case 'ss':
          seconds.push(('0' + i).substr(-2, 2));
          break;
      }
    }
    return seconds;
  }




  get apms() {
    switch (this.apmType) {
      case 'A':
        return ['AM', 'PM'];
      case 'a':
        return ['am', 'pm'];
      default:
        return [];
    }
  }



  get isTwelveHours() {
    return this.hourType === 'h' || this.hourType === 'hh';
  }

  checkAcceptingType(validValues, formatString, fallbackValue?) {
    if (!validValues || !formatString || !formatString.length) { return ''; }
    const length = validValues.length;
    for (let i = 0; i < length; i++) {
      if (formatString.indexOf(validValues[i]) > -1) {
        return validValues[i];
      }
    }
    return fallbackValue || '';
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown && !this.disabled;
    if (!this.showDropdown) {
      // this.$emit('blur', {
      //   ...this.value
      // });
    } else {
      // focus on the first select element
      setTimeout(() => { document.getElementById('hours').focus(); }, 0);
    }
  }

  clearTime() {

    this.value[this.hourType] = '';
    this.value[this.minuteType] = '';
    this.apm = this.apms[0];
    // this.$emit('input', time);

    this.onChange();
  }

  isInsideComponent(el) {
    // while (el) {
    //   if (el === this.$el) {
    //     return true;
    //   } else {
    //     el = el.parentElement;
    //   }
    // }
    return false;
  }


  onLoseFocus(e) {
    if (this.showDropdown && e.relatedTarget && !this.isInsideComponent(e.relatedTarget)) {
      this.toggleDropdown();
    }
  }

  onKeyDown(e) {
    if (e && e.key === 'Escape' && this.showDropdown) {
      this.toggleDropdown();
    }
  }

  onChange() {
    this.timeChange.emit(this.value);
    console.log('AppComponent -> onChange ->  this.timeChange.emit(event)', this.value);

  }

  setHours(h) {
    this.value[this.hourType] = h;
    this.onChange();

  }
  setMinutes(m) {
    this.value[this.minuteType] = m;
    this.onChange();
  }
}


