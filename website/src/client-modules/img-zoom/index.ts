import siteConfig from '@generated/docusaurus.config';
import type { ClientModule } from '@docusaurus/types';
import './zoom.scss';

const { themeConfig } = siteConfig;
const { imgZoom }: { imgZoom?: ZoomOptions } = themeConfig;
const { selector = '.markdown img', scrollOffset = 45, zoomedInClass = '' } = imgZoom || ({} as ZoomOptions);

type ZoomOptions = {
  selector: string;
  scrollOffset: number;
  zoomedInClass: string;
}

const zoom = () => {
  var zoomActive = false;
  var busy = false;
  var overlay = null;
  var scrollPosition = 0;
  var images = [];

  const start = () => {
    document.body.addEventListener('click', _clickHandler);
    document.addEventListener('keyup', _keyUpHandler);
    document.addEventListener('scroll', _scrollHandler);
    window.addEventListener('resize', _resizeHandler);

    images = Array.from(document.querySelectorAll(selector)).filter(e => e.tagName === 'IMG');
    _attachToImages(images);
  };

  const tearDown = () => {
    document.body.removeEventListener('click', _clickHandler);
    document.removeEventListener('keyup', _keyUpHandler);
    document.removeEventListener('scroll', _scrollHandler);
    window.removeEventListener('resize', _resizeHandler);
    _detachFromImages(images);

    images = [];
    zoomActive = false;
    busy = false;
    scrollPosition = 0;
  }

  const _clickHandler = event => {
    if (busy) {
      return;
    }
    if (zoomActive) {
      _closeZoom(event);
      return;
    }
    const { target } = event
    if (images.indexOf(target) === -1) {
      return
    }
    _zoom(event);
  }

  const _scrollHandler = () => {
    if (!zoomActive) {
      return;
    }
    const delta = scrollPosition - _getScrollTop();
    if (Math.abs(delta) > scrollOffset) {
      _closeActiveZoom();
    }
  }

  const _keyUpHandler = event => {
    if (!zoomActive) {
      return;
    }
    const key = event.key || event.keyCode
    if (key === 'Escape' || key === 'Esc' || key === 27) {
      _closeActiveZoom();
    }
  }

  const _resizeHandler = () => {
    if (!zoomActive) {
      return;
    }
    _closeActiveZoom();
  }

  const _attachToImages = (images: Element[]) => {
    images.forEach(img => {
      img.classList.add('zoom-img');
    });
  }

  const _detachFromImages = (images: Element[]) => {
    images.forEach(img => {
      img.classList.remove('zoom-img');
    });
  }

  const _zoom = event => {
    event.stopPropagation();
    zoomActive = true;
    scrollPosition = _getScrollTop();

    overlay = document.createElement('div');
    overlay.classList.add('zoom-overlay');
    document.body.appendChild(overlay);

    const targetImage = event.target;
    const img = document.createElement('img');
    img.onload = () => {
      document.body.classList.add('zoom-overlay-open');
      overlay.appendChild(img);
    };
    img.src = targetImage.currentSrc || targetImage.src;
    if (zoomedInClass.length) {
      img.classList.add(zoomedInClass);
    }
  }

  const _closeZoom = event => {
    event.stopPropagation();
    _closeActiveZoom();
  }

  const _closeActiveZoom = () => {
    busy = true;
    document.body.addEventListener('transitionend', _closed);
    document.body.classList.remove('zoom-overlay-open');
  }

  const _closed = () => {
    document.body.removeEventListener('transitionend', _closed);
    document.body.removeChild(overlay);
    busy = false;
    zoomActive = false;
  }

  const _getScrollTop = () => {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  return { start, tearDown };
};

const zoomModule = zoom();

const module: ClientModule = {
  onRouteUpdate({ location, previousLocation }) {
    if (location.pathname !== previousLocation?.pathname) {
      return () => zoomModule.tearDown();
    }
    return undefined;
  },
  onRouteDidUpdate({ location, previousLocation }) {
    if (location.pathname !== previousLocation?.pathname) {
      zoomModule.start();
    }
  },
};
export default module;