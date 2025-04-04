// 문서가 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // 워드 클라우드 애니메이션
    const words = document.querySelectorAll('.word');
    
    // 초기 애니메이션
    words.forEach(word => {
        const randomDelay = Math.random() * 1;
        word.style.opacity = '0';
        word.style.animation = `fadeIn 0.5s ease forwards ${randomDelay}s`;
    });
    
    // 호버 효과 강화
    words.forEach(word => {
        word.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.2)';
            this.style.zIndex = '10';
            this.style.backgroundColor = 'var(--accent-color)';
        });
        
        word.addEventListener('mouseout', function() {
            const originalTransform = this.style.transform;
            this.style.transform = originalTransform.replace('scale(1.2)', '');
            this.style.zIndex = '';
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
    
    // 3D 효과 추가
    let animationFrameId;
    const wordCloud = document.querySelector('.word-cloud');
    
    // 모바일 장치 감지
    let isMobile = window.innerWidth <= 768;
    let isSmallMobile = window.innerWidth <= 480;
    
    function animateCloud() {
        words.forEach((word, index) => {
            // 모바일에서는 애니메이션 범위 축소
            const amplitudeMultiplier = isMobile ? 0.6 : 1;
            const speedMultiplier = isMobile ? 0.7 : 1;
            
            // 아주 작은 화면에서는 더 축소
            if (isSmallMobile) {
                // 일부 단어들은 표시하지 않음 (CSS에서 처리)
                if (word.classList.contains('w13') || word.classList.contains('w14') || 
                    word.classList.contains('w16') || word.classList.contains('w17') || 
                    word.classList.contains('w19') || word.classList.contains('w20')) {
                    return;
                }
            }
            
            const baseTransform = window.getComputedStyle(word).transform;
            const time = Date.now() * 0.001 * speedMultiplier + index;
            const offsetY = Math.sin(time * 0.5) * 5 * amplitudeMultiplier;
            const offsetX = Math.cos(time * 0.3) * 5 * amplitudeMultiplier;
            
            word.style.transform = `${baseTransform} translate(${offsetX}px, ${offsetY}px)`;
        });
        
        animationFrameId = requestAnimationFrame(animateCloud);
    }
    
    // 애니메이션 시작
    animateCloud();
    
    // 페이지 떠날 때 애니메이션 정리
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationFrameId);
    });
    
    // 화면 크기 변경 시 애니메이션 재조정
    window.addEventListener('resize', () => {
        // 화면 크기에 따라 변수 업데이트
        isMobile = window.innerWidth <= 768;
        isSmallMobile = window.innerWidth <= 480;
    });
    
    // 네비게이션 활성화 기능
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // 네비게이션 클릭 이벤트
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // 활성화 클래스 추가
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 죄목 카드 애니메이션 효과
    const chargeCards = document.querySelectorAll('.charge-card');
    
    // Intersection Observer를 사용하여 요소가 화면에 나타날 때 애니메이션 적용
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // 초기 스타일 설정 및 Observer 등록
    chargeCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // 검색 기능 추가
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '죄목 검색...';
    searchInput.classList.add('search-input');
    
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');
    searchContainer.appendChild(searchInput);
    
    const navContainer = document.querySelector('nav .container');
    navContainer.appendChild(searchContainer);
    
    // 검색 기능 구현
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const chargeCards = document.querySelectorAll('.charge-card');
        
        chargeCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('.charge-body').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
                // 검색어 하이라이트 (간단한 구현)
                if (searchTerm.length > 0) {
                    card.style.boxShadow = '0 0 0 2px var(--secondary-color)';
                } else {
                    card.style.boxShadow = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        // 검색 결과가 없는 섹션 숨기기
        sections.forEach(section => {
            const visibleCards = section.querySelectorAll('.charge-card[style="display: block"]');
            if (visibleCards.length === 0 && searchTerm.length > 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    });
    
    // 맨 위로 스크롤 버튼 추가
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.classList.add('scroll-top-btn');
    document.body.appendChild(scrollTopBtn);
    
    // 스크롤 위치에 따라 버튼 표시/숨김
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // 버튼 클릭 시 맨 위로 스크롤
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 현재 날짜 표시
    const dateElements = document.querySelectorAll('.date');
    const today = new Date();
    const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    
    dateElements.forEach(el => {
        el.textContent = formattedDate;
    });
});
