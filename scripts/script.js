const carouselContainer = document.querySelector('.carousel-container')
const scrollStep = 270;

const btnCloting = document.getElementById('btnCloting');

function createCarousel(title) {
    // Crear título
    const tipe = document.createElement('div');
    tipe.classList.add('carousel-title');
    tipe.innerHTML = `<h3>${title}</h3>`;

    // Contenedor principal
    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('carousel-wrapper');

    // Crear carrusel
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');

    // Crear botones
    const prev = document.createElement('button');
    prev.classList.add('prev');
    prev.textContent = '❮';

    const next = document.createElement('button');
    next.classList.add('next');
    next.textContent = '❯';

    // Agregar elementos
    carouselWrapper.appendChild(prev);
    carouselWrapper.appendChild(carousel);
    carouselWrapper.appendChild(next);

    // Agregar todo al contenedor general
    carouselContainer.appendChild(tipe);
    carouselContainer.appendChild(carouselWrapper);

    // Retornar los elementos que se necesitan para manipular el carrusel
    return { carousel, prev, next };
}


async function renderCategoryCarousel(categoryToFilter, displayTitle) {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        
        const { carousel, prev, next } = createCarousel(displayTitle);

        const filteredProducts = [];
        
        data.forEach(element => {
            
            let match = false;
            // La API usa 'men's clothing' y 'women's clothing'
            if (categoryToFilter === 'Clothing' && 
                (element.category === "men's clothing" || element.category === "women's clothing")) {
                match = true;
            } else if (element.category === categoryToFilter.toLowerCase()) {
                match = true;
            }

            if (match) {
                const titleTag = (categoryToFilter === 'Electronics') ? 'h4' : 'h3';
                
                const product = document.createElement('div');
                product.classList.add('product');
                product.innerHTML = `
                    <h3>${element.category}</h3>
                    <img src="${element.image}" alt="${element.title}">
                    <${titleTag}>${element.title}</${titleTag}>
                    <p>$${element.price}</p>
                    <button class="product-btn">Agregar al carrito</button>
                `;
                
                carousel.appendChild(product);
                filteredProducts.push(product); //agregamos al array para saber cuanto hay 
            }
        });

        //3 productos minimo para mostrar las flechas
        if (filteredProducts.length <= 3) { 
            prev.style.display = 'none';
            next.style.display = 'none';
        } else {
            next.addEventListener('click', () => {
                carousel.scrollBy({ left: scrollStep, behavior: 'smooth' });
            });
            prev.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollStep, behavior: 'smooth' });
            });
        }
        
    } catch (error) {
        console.error(`Error al cargar productos para ${categoryToFilter}:`, error);
    }
}


const btnClothing = document.getElementById('btnClothing'); 
const btnJewelery = document.getElementById('btnJewelery');
const btnElectronics = document.getElementById('btnElectronics');
const btnAll = document.getElementById('btnAll');


function showProducts(category = 'ALL') {
    // 1. Limpiar todo el contenedor ANTES de cargar nuevos carruseles
    carouselContainer.innerHTML = '';

    if (category === 'ALL') {
        // Carga los tres carruseles iniciales
        renderCategoryCarousel('Clothing', 'Clothing');
        renderCategoryCarousel('Jewelery', 'Jewelery');
        renderCategoryCarousel('Electronics', 'Electronics');
    } else {
        // Carga solo la categoría seleccionada
        renderCategoryCarousel(category, category);
    }
}

function setupEventListeners() {
    // Configura el botón de ropa para mostrar SOLO ropa
    if (btnClothing) {
        btnClothing.addEventListener('click', () => {
            showProducts('Clothing'); 
        });
    }

    if (btnAll) {
        btnAll.addEventListener('click', () => {
            showProducts('ALL'); 
        });
    }

    if(btnJewelery){
        btnJewelery.addEventListener('click', () => {
            showProducts('Jewelery');
        });
    }
    if(btnElectronics){
        btnElectronics.addEventListener('click', () => {
            showProducts('Electronics');
        });
    }
    
    // ... Agregar listeners para los demás botones aquí
}


setupEventListeners();
showProducts('ALL');

console.log("hola");