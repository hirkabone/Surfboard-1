let myMap;
const init = () => {
    myMap = new ymaps.Map('map', {
        center: [55.749101, 37.602588],
        zoom: 14,
        controls: []
    });

    const coords = [
        [55.749081, 37.604367]
    ];

    const myCollection = new ymaps.GeoObjectCollection({}, {
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: './images/Icons/marker.svg',
        iconImageSize: [46, 57],
        iconImageOffset: [-35, -52],
    });

    coords.forEach(coord => {
        myCollection.add(new ymaps.Placemark(coord));
    });

    myMap.geoObjects.add(myCollection);

    myMap.behaviors.disable('scrollZoom');
};

ymaps.ready(init);