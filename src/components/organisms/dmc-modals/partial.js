import ObjectAssign from 'object-assign';
import riot from 'riot';
import { constants as actions } from '../../../store/actions';

export default function() {
  const store = this.riotx.get();

  let tag;

  this.fadeIn = () => {
    setTimeout(() => {
      this.root.classList.add('Modal--visible');
    }, 100);
  };

  this.fadeOut = () => {
    this.root.classList.remove('Modal--visible');

    setTimeout(() => {
      store.action(actions.MODALS_REMOVE, this.opts.id);
    }, 1000);
  };

  this.on('mount', () => {
    tag = riot.mount(this.refs.content, this.opts.tagname, ObjectAssign({
      isModal: true,
      modalCloser: this.fadeOut
    }, this.opts.tagopts))[0];
    this.fadeIn();
    window.addEventListener('keydown', this.handleKeyDown);
  });

  this.on('before-unmount', () => {
    tag.unmount(true);
  });

  this.on('unmount', () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  });

  this.handleTap = () => {
    this.fadeOut();
  };

  this.handleFrameTap = e => {
    // frameの内側のイベントを外側に伝播させない。
    if (!e.target.classList.contains('Modal__frame')) {
      return;
    }
    this.fadeOut();
  };

  this.handleCloseButtonTap = () => {
    this.fadeOut();
  };

  this.handleKeyDown = e => {
    switch (e.keyCode) {
    case 27: // Esc
      this.fadeOut();
      break;
    default:
      break;
    }
  };
}