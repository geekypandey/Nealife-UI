import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'nl-accordion-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent {
  // @ContentChildren(HeaderTemplateDirective) templates!: QueryList<HeaderTemplateDirective>;
  // @ContentChild(HeaderTemplateDirective) headerTemplate!: HeaderTemplateDirective;
  @ContentChild('header') headerTemplate!: TemplateRef<any>;
  @ContentChild('body') bodyTemplate!: TemplateRef<any>;

  toggleAccordion: boolean = false;
}
