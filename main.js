const backgrounds = new BackgroundsModule(['menu', 'game'], 'menu');


const licenseView = new View('license',
    () => {
        backgrounds.setActive('menu')
    },
    () => {

    }
);

const menuView = new View('menu',
    () => {
        backgrounds.setActive('menu')
    },
    () => {
        const menu = document.querySelector('.view_menu');
        menu.classList.add('view_deactivated');
        setTimeout(() => {
            menu.classList.remove('view_deactivated');
        }, 300);
    }
);

const gameView = new View('game',
    () => {
        backgrounds.setActive('game')
    },
    () => {

    }
);

const viewController = new ViewController(gameView);

function acceptLicense() {
    viewController.setView(menuView);
}

function playGame() {
    viewController.setView(gameView);
}


class BarItems {
    constructor() {
        this.addActiveToggle();
        this.closeOnBodyClick();
    }

    closeOnBodyClick() {
        document.body.addEventListener('click', e => {
            let contains = false;
            const check = (el) => {

                if (el.classList.contains('bar-item')) {
                    contains = true;
                }

                if (el.parentNode !== document.body) {
                    check(el.parentNode);
                } else {
                    if (!contains) {
                        Array.from(document.querySelectorAll('.bar-item_active')).forEach(e => e.classList.remove('bar-item_active'))
                    }
                }
            }
            check(e.target);
        })
    }

    addActiveToggle() {
        Array.from(document.querySelectorAll('.bar-item')).forEach(el => {
            const handler = (e) => {
                e.stopPropagation();
                if (el.classList.contains('bar-item_active')) {
                    el.classList.remove('bar-item_active')
                } else {
                    Array.from(document.querySelectorAll('.bar-item_active')).forEach(e => e.classList.remove('bar-item_active'))
                    el.classList.add('bar-item_active')
                }
            }
            el.addEventListener('click', handler);
            el.addEventListener('touch', handler);
        });

        this.fixClosingWhenClickOnMoreArea();
    }

    fixClosingWhenClickOnMoreArea() {
        Array.from(document.querySelectorAll('.bar-item__more')).forEach(el => {
            el.addEventListener('click', e => e.stopPropagation());
            el.addEventListener('touch', e => e.stopPropagation());
        })
    }
}

new BarItems();