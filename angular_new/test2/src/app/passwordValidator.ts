import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return null;
    if (value.indexOf(' ') >= 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }
}
