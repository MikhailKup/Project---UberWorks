window.addEventListener('DOMContentLoaded', () => {

	//? ---------------------------------------------------
	//* Hamburger menu
	const menu = document.querySelector('.menu'),
		menuItem = document.querySelectorAll('.menu__item'),
		hamburger = document.querySelector('.hamburger');

	hamburger.addEventListener('click', () => {
		hamburger.classList.toggle('hamburger__active');
		menu.classList.toggle('menu__active');
	});

	menuItem.forEach(item => {
		item.addEventListener('click', () => {
			hamburger.classList.toggle('hamburger__active');
			menu.classList.toggle('menu__active');
		})
	})


	//? ---------------------------------------------------
	//* Modal window
	const modal = document.querySelector('.modal');
	const modalBtns = document.querySelectorAll('[data-modal]');

	// Функция открытия
	const openModal = () => {
		modal.classList.add('show');
		modal.classList.add('fade');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
	};
	modalBtns.forEach((item) => {
		 item.addEventListener('click', openModal);
	});

	// Функция закрытия
	const closeModal = () => {
		modal.classList.add('hide');
		modal.classList.remove('show');
		modal.classList.remove('fade');
		document.body.style.overflow = '';
	};
	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});
  	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});


	//? ---------------------------------------------------
	//* Sending a request from a form

	const form = document.querySelector('form');

	const message = {
		loading: 'icons/spinner.svg',
		success: 'Спасибо! Скоро с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	// Функция постинга данных
	const postData = (form) => {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);
			const object = {};
			formData.forEach((value, key) => {
				object[key] = value;
			});


			fetch('server.php', {
				method: 'POST',
				headers: {
				'Content-type': 'application/json'
				},
				body: JSON.stringify(object)
			})
			.then(data => data.text())
			.then(data => {
				console.log(data);
				showThanksModal(message.success);
				statusMessage.remove();
			})
			.catch(() => {
				showThanksModal(message.failure);
			})
			.finally(() => {
				form.reset();
			});
		});
	};
	postData(form);

	// Оповещение Пользователя
	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');
		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
		<div class="modal__content">
			<div data-close class="modal__close">&times;</div>
			<div class="modal__title">${message}</div>
		</div>
		`;
		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	};
})