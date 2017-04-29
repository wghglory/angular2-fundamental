import { Directive } from '@angular/core';
import { FormGroup, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
    selector: '[validateLocation]',
    providers: [{ provide: NG_VALIDATORS, useExisting: LocationValidator, multi: true }], //use multi:true to add LocationValidator to NG_VALIDATORS which is a list of angular built-in validators, otherwise can replace/override
})
export class LocationValidator implements Validator {

    validate(formGroup: FormGroup): { [key: string]: any } {
        const addressControl = formGroup.controls['address'];
        const cityControl = formGroup.controls['city'];
        const countryControl = formGroup.controls['country'];
        const onlineUrlControl = (formGroup.root as FormGroup).controls['onlineUrl'];

        if ((addressControl && addressControl.value
            && cityControl && cityControl.value
            && countryControl && countryControl.value)
            || (onlineUrlControl && onlineUrlControl.value)) {
            return null;
        } else {
            return { validateLocation: false };
        }
    }

}
