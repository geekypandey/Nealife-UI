import { Directive, ElementRef, Host, Renderer2 } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[nlShowErrorMsg]',
  standalone: true,
})
export class ShowErrorMsgDirective {
  private errorMessageElement!: HTMLElement | null;
  private subscription!: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Host() private ngControl: NgControl
  ) {}

  ngOnInit() {
    // if (this.ngControl && this.ngControl.control) {
    //   this.ngControl.control.statusChanges.subscribe(() => {
    //     this.updateErrorMessage();
    //   });
    // }
    this.subscribeToStatusChanges();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private subscribeToStatusChanges() {
    this.unsubscribe();
    const parentFormGroup = this.findParentFormGroup(this.ngControl.control);
    if (parentFormGroup) {
      this.subscription = parentFormGroup.valueChanges.subscribe(() => {
        this.updateErrorMessage();
      });
    }
  }

  private findParentFormGroup(control: AbstractControl | null): AbstractControl | null {
    let parent = control?.parent;
    while (parent) {
      if (parent instanceof AbstractControl) {
        return parent;
      }
      parent = parent['parent'];
    }
    return null;
  }

  private updateErrorMessage() {
    const control = this.ngControl.control;
    const errors = control?.errors;

    if (errors) {
      this.showErrorMessage(errors);
    } else {
      this.hideErrorMessage();
    }
  }
  private showErrorMessage(errors: any) {
    // this.renderer.addClass(this.el.nativeElement, 'error');
    if (!this.errorMessageElement) {
      this.createErrorMessageElement(errors);
    } else {
      this.updateErrorMessageContent(errors);
    }
  }

  private hideErrorMessage() {
    // this.renderer.removeClass(this.el.nativeElement, 'error');
    this.removeErrorMessageElement();
  }

  private createErrorMessageElement(errors: any) {
    const errorMessages = Object.keys(errors).map(key => this.getErrorMessage(key, errors[key]));

    this.errorMessageElement = this.renderer.createElement('div');
    this.renderer.addClass(this.errorMessageElement, 'p-error');

    errorMessages.forEach(message => {
      const messageElement = this.renderer.createElement('div');
      this.renderer.appendChild(messageElement, this.renderer.createText(message));
      this.renderer.appendChild(this.errorMessageElement, messageElement);
    });

    const parent = this.renderer.parentNode(this.el.nativeElement);
    const nextSibling = this.renderer.nextSibling(this.el.nativeElement);

    if (nextSibling) {
      this.renderer.insertBefore(parent, this.errorMessageElement, nextSibling);
    } else {
      this.renderer.appendChild(parent, this.errorMessageElement);
    }
  }

  private updateErrorMessageContent(errors: any) {
    // Update the content of the existing error message element
    const errorMessages = Object.keys(errors).map(key => this.getErrorMessage(key, errors[key]));
    if (this.errorMessageElement) {
      while (this.errorMessageElement.firstChild) {
        this.errorMessageElement.removeChild(this.errorMessageElement.firstChild);
      }
    }

    errorMessages.forEach(message => {
      const messageElement = this.renderer.createElement('div');
      this.renderer.appendChild(messageElement, this.renderer.createText(message));
      this.renderer.appendChild(this.errorMessageElement, messageElement);
    });
  }

  private removeErrorMessageElement() {
    if (this.errorMessageElement) {
      const errorMessageElement = this.el.nativeElement.nextElementSibling;
      if (errorMessageElement && errorMessageElement.classList.contains('p-error')) {
        this.renderer.removeChild(this.el.nativeElement.parentNode, errorMessageElement);
        this.errorMessageElement = null;
      }
    }
  }

  private getErrorMessage(errorType: string, errorValue: any): string {
    switch (errorType) {
      case 'required':
        return 'This field is required';
      case 'pattern':
        return 'Invalid'; // 'Invalid pattern';
      case 'maxlength':
        return `This field cannot be longer than ${errorValue.requiredLength} characters.`;
      case 'minlength':
        return `This field cannot be lesser than ${errorValue.requiredLength} characters.`;
      case 'nonUnique':
        return `This field is not unique.`;
      default:
        return `Invalid ${errorType}`;
    }
  }
}
