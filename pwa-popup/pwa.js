jQuery(document).ready(function($){

	//добавляем функционал только для touch устройств
	if ("ontouchstart" in document.documentElement)
	{
		//PWA vars
		var deferredPrompt,
			btnPwa = document.querySelector('.js-pwa-btn'),
			pwaBlock = document.querySelector('.wrap-pwa-block'),
			btnPwaExit = document.querySelector('.js-pwa-exit');

		//localStorage vars
		var dateView = new Date(),
			name_s = "date_time",
			ses;
			

		dateView = dateView.getTime();


		function anim_banner(){
			pwaBlock.style.display = 'block';
		}
		
		function iOS() {
			return [
			'iPad Simulator',
			'iPhone Simulator',
			'iPod Simulator',
			'iPad',
			'iPhone',
			'iPod',
			'MacIntel'
			].includes(navigator.platform)
			// iPad on iOS 13 detection
			|| (navigator.userAgent.includes("Mac") && "ontouchend" in document)
		}

		function changeLocalStorage(time_session){
			//скрываем всплывашку в PWA
			var modeDisplay = getPWADisplayMode();
			if (modeDisplay == 'standalone') {
				pwaBlock.style.display = 'none';
			} else{

				if(localStorage.getItem(name_s) == null){
					//alert("показывать");
					setTimeout(anim_banner, 3000);
				} else{
					ses = Number(localStorage.getItem(name_s));
					ses = ses + time_session;

					if(ses > dateView){
						//alert("не показывать");
						pwaBlock.style.display = 'none';
					} else{	
						//alert("показывать");
						setTimeout(anim_banner, 3000);
						localStorage.removeItem(name_s);
					}
				}
			}
		}

		//проверяем открытие в PWA или нет
		function getPWADisplayMode() {
			const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
			if (document.referrer.startsWith('android-app://')) {
				return 'twa';
			} else if (navigator.standalone || isStandalone) {
				return 'standalone';
			}
			return 'browser';
		}

		//заменяем кнопку установки приложения на iOS
		if(iOS()){
			//console.log("iOS")
			var container = "Для установки нажмите <span class='dynamicovPWA_notification_icon'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 400 512'><path d='M336,192h40a40,40,0,0,1,40,40V424a40,40,0,0,1-40,40H136a40,40,0,0,1-40-40V232a40,40,0,0,1,40-40h40' style='fill:none;stroke:#0079ff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><polyline points='336 128 256 48 176 128' style='fill:none;stroke:#0079ff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><line x1='256' y1='321' x2='256' y2='48' style='fill:none;stroke:#0079ff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/></svg></span> , затем коснитесь «Добавить на экран 'Домой'».";
			var wrapOS = document.querySelector('.js-wrapOS');
			wrapOS.innerHTML = container;

			// time_session = 1200000; // 20мин
			time_session = 3300000; // 60мин
			changeLocalStorage(time_session);

		} else{
			//console.log("не iOS")
			// для всех кроме iOS добавляем проверку наличия установки PWA. Если не установлено то перехватываем стандартное событие
			window.addEventListener('beforeinstallprompt', (e) => {
				// Prevent Chrome 67 and earlier from automatically showing the prompt
				e.preventDefault();
				// Stash the event so it can be triggered later on the button event.
				deferredPrompt = e;
				
				time_session = 3300000; // 60мин

				changeLocalStorage(time_session);
				
			});
		}

		//button click event to show the promt
		// window.addEventListener('appinstalled', (event) => {
		// 	alert('installed');
		// 	pwaBlock.style.display = 'none';
			
		// });


		//button click event to show the promt	
		btnPwa.addEventListener('click', (e) => {
			pwaBlock.style.display = 'none';
			// Show the prompt
			deferredPrompt.prompt();
			// Wait for the user to respond to the prompt
			deferredPrompt.userChoice
			.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the prompt');
				} else {
					console.log('User dismissed the prompt');
				}
				deferredPrompt = null;
			});
		});

		//close pwa	
		btnPwaExit.addEventListener('click', (e) => {
			var dateView2 = new Date(),
				dateView2 = dateView2.getTime();
			localStorage.setItem(name_s,dateView2);

			pwaBlock.style.display = 'none';
		});

	}
	else {console.log("your device is NOT a touch device")}
});