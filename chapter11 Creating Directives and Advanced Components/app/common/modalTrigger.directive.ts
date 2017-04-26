import { Directive, OnInit, Inject, ElementRef, Input } from '@angular/core'
import {JQ_TOKEN} from './jQuery.service'

@Directive({
    selector: '[modal-trigger]'  //attribute selector
})
export class ModalTriggerDirective implements OnInit {
    private el: HTMLElement;
    // @Input() modal-trigger: string  I want to write like this but typescript cannot compile dash...So use alias
    @Input('modal-trigger') modalId: string;

    constructor(ref: ElementRef, @Inject(JQ_TOKEN) private $: any) {
        this.el = ref.nativeElement;
    }

    ngOnInit() {
        this.el.addEventListener('click', e => {
            // issue: we may have many modal windows for different purpose, so need to pass id dynamically
            // this.$('#simple-modal').modal({})
            
            this.$(`#${this.modalId}`).modal({});
        });
    }
}
