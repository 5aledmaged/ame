import $ from 'jquery';

class Notification {
	constructor() {
		this.main = $('.ame-note'); // TODO: rename to body =========================
		this.text = $('.ame-note-txt');
		this.timeoutId = 0;
	}

	send(msg) {
		clearTimeout(this.timeoutId);	// clear previous notification if any
		this.main.hide();
		this.text.html(msg);
		this.main.fadeIn(250, () => {
			this.timeoutId = setTimeout(() => {
				this.main.fadeOut(250);
			}, 1500);
		});
	}
}

const note = new Notification();

export default note;