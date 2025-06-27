// HTMLドキュメントの読み込みが完了したら、中の処理を実行する
document.addEventListener('DOMContentLoaded', () => {

    /**
     * ==================================
     * 機能1: 天気予報ウィジェット
     * ==================================
     */
    const fetchWeather = async () => {
        const weatherWidget = document.getElementById('weather-info');
        if (!weatherWidget) return; // 要素がなければ何もしない

        const apiUrl = 'https://wttr.in/Osaka?format=j1';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('天気情報の取得に失敗');
            const data = await response.json();

            const currentCondition = data.current_condition[0];
            const todayWeather = data.weather[0];
            const description = currentCondition.weatherDesc[0].value;
            const tempC = currentCondition.temp_C;
            const maxTemp = todayWeather.maxtempC;
            const minTemp = todayWeather.mintempC;

            let weatherIcon = 'fa-solid fa-cloud-sun';
            if (description.includes('Sunny') || description.includes('Clear')) weatherIcon = 'fa-solid fa-sun';
            else if (description.includes('Rain') || description.includes('Shower')) weatherIcon = 'fa-solid fa-cloud-showers-heavy';
            else if (description.includes('Cloudy')) weatherIcon = 'fa-solid fa-cloud';
            else if (description.includes('Snow')) weatherIcon = 'fa-solid fa-snowflake';

            weatherWidget.innerHTML = `
                <div class="weather-main">
                    <i class="${weatherIcon}"></i>
                    <span class="weather-temp">${tempC}°C</span>
                    <span class="weather-desc">${description}</span>
                </div>
                <div class="weather-sub">
                    <span>最高: ${maxTemp}°C</span> / <span>最低: ${minTemp}°C</span>
                </div>
            `;
        } catch (error) {
            weatherWidget.innerHTML = '<p>天気情報を取得できませんでした。</p>';
        }
    };

    /**
     * ==================================
     * 機能2: スクロールに応じたアニメーション
     * ==================================
     */
    const setupScrollAnimations = () => {
        // アニメーションさせたい要素をすべて取得
        const animatedElements = document.querySelectorAll('.card, .parallax-content, .feature-image, .feature-content');
        if (animatedElements.length === 0) return;

        // カード用のランダムなアニメーションパターン
        const cardAnimationPatterns = ['fade-in-up', 'fade-in-left', 'fade-in-right'];
        
        // 各要素にアニメーションの種類を割り当て
        animatedElements.forEach(el => {
            if (el.classList.contains('card')) {
                // カード要素にはパターンをランダムに割り当て
                const pattern = cardAnimationPatterns[Math.floor(Math.random() * cardAnimationPatterns.length)];
                el.classList.add(pattern);
            } else if (el.classList.contains('parallax-content')) {
                el.classList.add('fade-in-up');
            } else if (el.classList.contains('feature-image')) {
                el.classList.add('fade-in-left');
            } else if (el.classList.contains('feature-content')) {
                el.classList.add('fade-in-right');
            }
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // 要素が10%見えたら発火

        animatedElements.forEach(el => observer.observe(el));
    };

    /**
     * ==================================
     * 機能3: パララックス効果
     * ==================================
     */
    const setupParallax = () => {
        const parallaxSection = document.querySelector('.parallax-section');
        if (!parallaxSection) return;

        window.addEventListener('scroll', () => {
            // requestAnimationFrameを使ってスクロールイベントを最適化
            window.requestAnimationFrame(() => {
                const rect = parallaxSection.getBoundingClientRect();
                
                // セクションが画面内に見えている時だけ処理を実行
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const speed = -0.3; // 背景がスクロールする速度（マイナスで逆方向に動く）
                    const yPos = rect.top * speed;
                    parallaxSection.style.backgroundPosition = `center ${yPos}px`;
                }
            });
        });
    };


    // ==================================
    // 各機能の初期化・実行
    // ==================================
    fetchWeather();
    setupScrollAnimations();
    setupParallax();

});