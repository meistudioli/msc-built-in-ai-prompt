export const _wccss = `
/* reset */
div,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,legend,input,textarea,p,article,aside,figcaption,figure,nav,section,mark,audio,video,main{margin:0;padding:0}
article,aside,figcaption,figure,nav,section,main{display:block}
fieldset,img{border:0}
address,caption,cite,em,strong{font-style:normal;font-weight:400}
ol,ul{list-style:none}
caption{text-align:left}
h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:400}
abbr{border:0;font-variant:normal}
input,textarea,select{font-family:inherit;font-size:inherit;font-weight:inherit;}
body{-webkit-text-size-adjust:none}
select,input,button,textarea{font:100% arial,helvetica,clean,sans-serif;}
del{font-style:normal;text-decoration:none}
pre{font-family:monospace;line-height:100%}
progress{-webkit-appearance:none;appearance:none;overflow:hidden;border:0 none;}

/* component style */
a{cursor:pointer;text-decoration:none;}
.stuff{text-indent:100%;white-space:nowrap;overflow:hidden;}
.aspect-ratio{position:relative;width:100%;--w:4;--h:3;}
.aspect-ratio:before{content:'';width:100%;padding-top:calc(var(--h) * 100% / var(--w));display:block;}
.aspect-ratio .content{position:absolute;top:0;left:0;right:0;bottom:0;}
.text-overflow{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.line-clampin{display:-webkit-box;-webkit-line-clamp:var(--line-clamp, 2);-webkit-box-orient:vertical;text-overflow:ellipsis;overflow:hidden;}
.overscrolling{-webkit-overflow-scrolling:touch;overflow:hidden;overflow-y:scroll;overscroll-behavior:contain;}
.overscrolling-x{-webkit-overflow-scrolling:touch;overflow:hidden;overflow-x:scroll;overscroll-behavior:contain;}
.absolute-center{position:absolute;top:0;left:0;bottom:0;right:0;margin:auto;}
.flex-center{display:flex;justify-content:center;align-items:center;}
.force-radius{overflow:hidden;transform:translate3d(0, 0, 0);border-radius:var(--r, 8px);}
.pretty-paragraph{word-break:break-word;hyphens:auto;text-wrap:pretty;white-space:pre-wrap;}
.fade-in-out {
  --min-block-size: var(--fade-in-out-min-block-size, 100px);
  --max-block-size: var(--fade-in-out-max-block-size, 500px);
  --gap: var(--fade-in-out-gap, 16px);

  --mask-vertical-size: var(--gap);
  --mask-vertical: linear-gradient(
    to bottom,
    transparent 0%,
    black calc(0% + var(--mask-vertical-size)),
    black calc(100% - var(--mask-vertical-size)),
    transparent 100%
  );

  /* scroll */
  --scrollbar-inline-size: 2px;
  --scrollbar-block-size: 2px;
  --scrollbar-background: transparent;
  --scrollbar-thumb: var(--fade-in-out-scrollbar-thumb-color, rgba(0 0 0/.2));

  inline-size: 100%;
  min-block-size: var(--min-block-size);
  max-block-size: var(--max-block-size);
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  box-sizing: border-box;
  mask-image: var(--mask-vertical);
  -webkit-mask-image: var(--mask-vertical);
  padding-block: var(--gap);

  &::-webkit-scrollbar {
    inline-size: var(--scrollbar-inline-size);
    block-size: var(--scrollbar-block-size);
  }

  &::-webkit-scrollbar-track {
    background: var(--scrollbar-background);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: var(--scrollbar-block-size);
    background: var(--scrollbar-thumb);
  }
}
.button-two-face {
  --button-size: 40;
  --button-size-with-unit: calc(var(--button-size) * 1px);
  --button-icon-scale-rate: .75;
  
  --button-background: rgba(202 230 252);
  --button-icon: rgba(8 28 53);
  --button-box-shadow: none;
  --button-active-scale: .8;

  --button-icon-scale-basis: calc((var(--button-size) * var(--button-icon-scale-rate)) / 24);
  --before-icon: none;
  --before-scale: var(--button-icon-scale-basis);
  --after-icon: none;
  --after-scale: 0;

  flex-shrink: 0;
  font-size: 0;
  appearance: none;
  box-shadow: unset;
  border: unset;
  background: transparent;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: auto;
  margin: 0;
  padding: 0;
  outline: 0 none;

  position: relative;
  inline-size: var(--button-size-with-unit);
  aspect-ratio: 1/1;
  border-radius: var(--button-size-with-unit);
  background: var(--button-background);
  box-shadow: var(--button-box-shadow);

  transition: background .2s ease;
  will-change: background;

  &:active {
    scale: var(--button-active-scale);
  }

  &::before,
  &::after {
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    content: '';
    inline-size: 24px;
    aspect-ratio: 1/1;
    background: var(--button-icon);
    margin-inline-start: -12px;
    margin-block-start: -12px;
    transition: scale 250ms ease;
    will-change: scale;
    pointer-events: none;
  }

  &::before {
    scale: var(--before-scale);
    clip-path: var(--before-icon);
  }

  &::after {
    scale: var(--after-scale);
    clip-path: var(--after-icon);
  }

  &[data-reverse] {
    --before-scale: 0;
    --after-scale: var(--button-icon-scale-basis);
  }
}

:host{all:initial;font-family:system-ui,sans-serif;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;font-size:16px;-webkit-tap-highlight-color:transparent;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
:host {
  /**
   * safe area variables for iX design
   */
  --safe-area-left: 0px;
  --safe-area-right: 0px;
  --safe-area-top: 0px;
  --safe-area-bottom: 0px;
}
@supports (bottom: env(safe-area-inset-top)) {
  :host {
    --safe-area-left: env(safe-area-inset-left);
    --safe-area-right: env(safe-area-inset-right);
    --safe-area-top: env(safe-area-inset-top);
    --safe-area-bottom: env(safe-area-inset-bottom);
  }
}
`;