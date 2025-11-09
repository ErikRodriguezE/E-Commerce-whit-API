const carouselContainer = document.querySelector('.carousel-container')
const scrollStep = 270;

const btnClothing = document.getElementById('btnClothing'); 
const btnJewelery = document.getElementById('btnJewelery');
const btnElectronics = document.getElementById('btnElectronics');
const btnAll = document.getElementById('btnAll');

const btnCloting = document.getElementById('btnCloting');

const pricesElements = new Map();
const productsName = new Map();
const productsImage = new Map();

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
        //carga el carrusel
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
                    <button class="product-btn" data-product-id="${element.id}">Agregar al carrito</button>
                `;
                
                carousel.appendChild(product);
                filteredProducts.push(product); //agregamos al array para saber cuanto hay 
            }
        });
        //guarda los precios
        data.forEach(element => {
            pricesElements.set(element.id, element.price);
        });
        //guarda los nombres
        data.forEach(element => {
            productsName.set(element.id, element.title);
        });
        //guarda las imagenes
        data.forEach(element => {
            productsImage.set(element.id, element.image);
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

const customDescriptions = new Map([
    [1, "¡La mochila todoterreno!💻 Espacio acolchado para portátil de 15. Perfecta para la ciudad o el bosque."],
    [2, "T-shirt Slim Fit premium con cuello Henley. Tejido suave y transpirable. Comodidad y estilo casual garantizados."],
    [3, "Chaqueta de algodón versátil. Ideal para viajes, hiking o el día a día. ¡Tu mejor abrigo para cualquier estación!"],
    [4, "Camisa casual Slim Fit. Importante: Revisa nuestra guía de tallas para un ajuste perfecto. ¡Estilo al mejor precio!"],
    [5, "Pulsera Naga de Leyenda (Oro/Plata). 🐉 Úsala hacia adentro para abundancia o hacia afuera para protección. Elegancia mística."],
    [6, "Elegancia en Oro Sólido. Micropavé delicado. ¡Tu satisfacción está garantizada! Devuelve o cambia tu pedido en 30 días."],
    [7, "El Anillo de Promesa perfecto.💍 Diseño clásico de Solitario con baño de Oro Blanco. El regalo ideal para compromiso, aniversario o San Valentín."],
    [8, "Expresa tu estilo con estos pendientes de Túnel Acampanado Doble. Acero inoxidable 316L con un hermoso baño de Oro Rosa."],
    [9, "Disco Duro Externo de 2TB. Transferencias rápidas con USB 3.0. Aumenta el rendimiento de tu PC. ¡Simplemente conecta y listo!"],
    [10, "Actualiza a la velocidad SSD de 1TB. Arranque y carga de apps ultra rápidos. El equilibrio perfecto entre rendimiento y confiabilidad. ¡Dale vida nueva a tu PC!"],
    [11, "SSD de 256GB con 3D NAND y tecnología SLC Cache. 🚀 Arranque ultra rápido y rendimiento optimizado. ¡Diseño delgado ideal para Ultrabooks!"],
    [12, "Disco Duro Externo de 4TB para tu PS4. Expande tu mundo gamer y juega donde quieras. Diseño elegante, configuración fácil y 3 años de garantía."],
    [13, "Monitor Full HD (1080p) IPS de 21.5. Diseño ultradelgado Zero-frame y tecnología Radeon FreeSync™. Ideal para trabajo y entretenimiento."],
    [14, "Monitor Gaming Curvo Super Ultrawide de 49 (32:9). 🎮 Tecnología QLED, 144Hz y 1ms. Vive la inmersión total en tus juegos."],
    [15, "Chaqueta 3 en 1 para mujer. ¡Perfecta para el invierno! Forro polar interno desmontable y capucha ajustable. Adaptable a diferentes climas y actividades."],
    [16, "Chaqueta Moto Biker de Piel Sintética con capucha desmontable 2 en 1. Un look atrevido y cómodo. ¡Solo lavado a mano!"],
    [17, "Chubasquero ligero con diseño de rayas. 🌬️ Resistente al viento y con cintura ajustable. Ideal para viajes o looks casuales con estilo."],
    [18, "Top de manga corta y ajuste cómodo. Escote Boat Neck V versátil. Tejido ligero con gran elasticidad. ¡Un básico esencial de fondo de armario!"],
    [19, "Camiseta deportiva de manga corta para mujer. 💧 Tejido que absorbe la humedad, altamente transpirable y preencogido. Comodidad y silueta femenina."],
    [20, "Camiseta casual de algodón con Letter Print y Cuello V. Un básico suave y elástico, perfecto para cualquier ocasión y temporada. 🌟"],
]);



setupEventListeners();
showProducts('ALL');
