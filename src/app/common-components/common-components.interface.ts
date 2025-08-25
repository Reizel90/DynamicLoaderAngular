
import {
  Directive,
  Input,
  HostBinding,
  OnChanges,
  SimpleChanges
} from '@angular/core';

export interface SpacingConfig {
  margin?: string;   // e.g. "8px 16px"
  padding?: string;  // e.g. "4px"
  border?: string;   // e.g. "1px solid #ddd"
}

export interface PositionConfig {
  position?: 'absolute' | 'relative' | 'static';
  top?: string;      // e.g. "10px"
  left?: string;     // e.g. "20px"
  zIndex?: number;
}


@Directive() // Base class for canvas items
export abstract class CanvasBaseComponent implements OnChanges {
  @Input() id!: string;
  @Input() spacing?: SpacingConfig;
  @Input() position?: PositionConfig;

  // Expose the ID as a data attribute
  @HostBinding('attr.data-id')
  get hostId(): string {
    return this.id;
  }

  // SPACING
  @HostBinding('style.margin')    spacingMargin: string | null = null;
  @HostBinding('style.padding')   spacingPadding: string | null = null;
  @HostBinding('style.border')    spacingBorder: string | null = null;

  // POSITIONING
  @HostBinding('style.position')  posPosition: string | null = null;
  @HostBinding('style.top')       posTop: string | null = null;
  @HostBinding('style.left')      posLeft: string | null = null;
  @HostBinding('style.z-index')   posZ: number | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spacing']) {
      this.applySpacing(this.spacing);
    }
    if (changes['position']) {
      this.applyPosition(this.position);
    }
  }

  private applySpacing(cfg?: SpacingConfig) {
    this.spacingMargin  = cfg?.margin  || null;
    this.spacingPadding = cfg?.padding || null;
    this.spacingBorder  = cfg?.border  || null;
  }

  private applyPosition(cfg?: PositionConfig) {
    this.posPosition = cfg?.position || null;
    this.posTop  = cfg?.top      || null;
    this.posLeft = cfg?.left     || null;
    this.posZ    = cfg?.zIndex   ?? null;
  }
}
