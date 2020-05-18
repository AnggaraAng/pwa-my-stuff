const informations = document.querySelector('.informations')

document.addEventListener('DOMContentLoaded', function () {
    //nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, { edge: 'right' });
    //add facilities form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, { edge: 'left' });

});

//render Information data
const renderInformation = (data, id) => {
    const html = `
    <div class="card-panel information white row" data-id="${id}">
            <img src="/img/facilities.png" alt="information thumb">
            <div class="information-details">
                <div class="information-title">${data.title}</div>
                <div class="information-specs">${data.specs}</div>
            </div>
            <div class="information-delete"> 
                <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
        `;

        informations.innerHTML += html;
};

//remove Informations
const removeInformation = (id) => {
    const information = document.querySelector(`.information[data-id=${id}]`);
    information.remove();
};