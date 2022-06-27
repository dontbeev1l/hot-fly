const backgrounds = new BackgroundsModule(['menu', 'game'], 'menu');

const GEL_PRICE = 10;

const nicks = new Nicknmes(12);
const wins = { you: 0 };
nicks.names.forEach(name => { wins[name] = Math.round(Math.random() * 20); })

let storage = new Storage({
    balance: 1000,
    gel: 33,
    users: nicks,
    wins: wins,
});

const licenseView = new View('license',
    () => {
        backgrounds.setActive('menu');
    },
    () => {

    }
);

const menuView = new View('menu',
    () => {
        // document.querySelector('.balance').classList.add('balance_active');
        backgrounds.setActive('menu');
    },
    () => {
        // document.querySelector('.balance').classList.remove('balance_active');
        const menu = document.querySelector('.view_menu');
        menu.classList.add('view_deactivated');
        setTimeout(() => {
            menu.classList.remove('view_deactivated');
        }, 300);
    }
);

const shopView = new View('shop',
    () => {
        backgrounds.setActive('menu');
        document.querySelector('.balance').classList.add('balance_active');
        document.querySelector('.home').classList.add('home_active');
    },
    () => {
        document.querySelector('.balance').classList.remove('balance_active');
        document.querySelector('.home').classList.remove('home_active');
    }
);

let currentGame;

const gameView = new View('game',
    () => {
        backgrounds.setActive('game');
        document.querySelector('.balance').classList.add('balance_active');
        document.querySelector('.home').classList.add('home_active');
    },
    () => {
        document.querySelector('.balance').classList.remove('balance_active');
        document.querySelector('.home').classList.remove('home_active');
        if (currentGame) {
            currentGame.destroy();
        }
    }
);

// const viewController = new ViewController(gameView);
const viewController = new ViewController(licenseView);

function acceptLicense() {
    viewController.setView(menuView);
}

function openMenu() {
    viewController.setView(menuView);
}

function playGame() {
    viewController.setView(gameView);
}

function openShop() {
    viewController.setView(shopView);
}

function drowTop() {
    let list = Object.entries(storage.get('wins'));
    list = list.sort((a, b) => b[1] - a[1]);
    console.log(list);

    const topItemsEl = document.querySelector('.top-items');
    topItemsEl.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        topItemsEl.insertAdjacentHTML('beforeend', `
        <div class="purple-block">
            <div class="purple-block__text">${list[i][0]}</div>
            <div class="purple-block__value">${list[i][1]}</div>
        </div>`)
    }
}

drowTop();

class GameItem {
    constructor(left, color, name, speed, clbk) {
        this.element = document.createElement('div');
        this.element.classList.add('game-item');
        this.element.innerHTML = `<span>${name}</span><img src="./img/b_${color}.svg">`;
        document.querySelector('.game-field').appendChild(this.element);
        this.speed = speed;
        this.clbk = clbk;
        this.active = true;
        this.position = Math.round(Math.random() * 10 + 16);
        this.element.style.top = `${100 - this.position}%`;
        this.element.style.left = `${left}%`;
        this.destroyed = false;
        this.animate()
    }

    animate() {
        const tick = () => {
            if (this.active) {
                setTimeout(() => tick(), 14);
            }

            this.position += this.speed;
            this.element.style.top = `${100 - this.position}%`;

            if (this.position >= 80) {
                this.active = false;
                this.clbk();
            }
        }

        tick();
    }

    destroy() {
        if (this.destroyed) { return; }
        this.destroyed = true;
        this.active = false;
        this.element.classList.add('game-item_destroyed');
        setTimeout(() => {
            document.querySelector('.game-field').removeChild(this.element);
        }, 300);
    }

}

class Game {
    constructor(color) {
        const bet = this.betByColor(color);
        if (bet > storage.get('balance')) {
            return;
        }
        storage.set('balance', storage.get('balance') - bet);
        updateBalance();
        const left = Math.round(Math.random() * 40 + 30);
        const opColor = ['yellow', 'teal', 'red', 'purple', 'blue'].sort(() => Math.random() - 0.5)[0];
        const win = this.betByColor(opColor) + bet;
        this.active = true;
        const oponentName = Nicknmes.getRandom(storage.get('users'));
        this.oponent = new GameItem(left - 8, opColor, oponentName, 0.08 + Math.random() * 0.02 - 0.01, () => {
            if (!this.active) {
                return;
            }
            this.active = false;
            storage.data.wins[oponentName] += 1;
            storage.set('wins', storage.data.wins);
            this.you.destroy();
            drowTop();
        })
        this.you = new GameItem(left, color, 'You', 0.08, () => {
            if (!this.active) {
                return;
            }
            this.oponent.destroy();
            this.active = false;
            storage.data.wins['you']++;
            storage.set('wins', storage.data.wins);
            storage.set('balance', storage.get('balance') + win);
            updateBalance();
            drowTop();
        })
    }

    destroy() {
        this.active = false;
        this.oponent.destroy();
        this.you.destroy();
    }

    betByColor(color) {
        return {
            yellow: 5,
            teal: 10,
            red: 20,
            purple: 50,
            blue: 100
        }[color];
    }
}

function updateGelCont() {
    gelCount.innerHTML = `${storage.get('gel')}%`;
    document.querySelector('.gas-count-value').innerHTML = `${storage.get('gel')}%`;
    document.querySelector('.gas-count').style.height = storage.get('gel') / 100 * 92 + 'px';
}

function updateBalance() {
    console.log('BALANCE', storage.get('balance'));
    balanceValue.innerHTML = storage.get('balance');
}

function play(color) {
    Array.from(document.querySelectorAll('.bar-item_active')).forEach(e => e.classList.remove('bar-item_active'));
    document.querySelector('.baloons-bar-wrapper').classList.remove('baloons-bar-wrapper_active');
    if (currentGame) {
        currentGame.destroy();
        currentGame = null;
    };

    currentGame = new Game(color)
}

updateGelCont();
updateBalance();

function buyGel() {
    if (storage.get('balance') < GEL_PRICE || storage.get('gel') >= 100) {
        return;
    }

    storage.set('gel', storage.get('gel') + 1);
    storage.set('balance', storage.get('balance') - GEL_PRICE);
    updateBalance();
    updateGelCont();
}


function useGel() {
    if (!currentGame || !currentGame.active) {
        return;
    }
    if (storage.get('gel') < 1) {
        return;
    }
    storage.set('gel', storage.get('gel') - 1);
    currentGame.you.position += 0.3;
    updateGelCont();
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
                        document.querySelector('.baloons-bar-wrapper').classList.remove('baloons-bar-wrapper_active');
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
                    el.classList.remove('bar-item_active');
                    document.querySelector('.baloons-bar-wrapper').classList.remove('baloons-bar-wrapper_active');
                } else {
                    Array.from(document.querySelectorAll('.bar-item_active')).forEach(e => e.classList.remove('bar-item_active'))
                    el.classList.add('bar-item_active');
                    document.querySelector('.baloons-bar-wrapper').classList.add('baloons-bar-wrapper_active');
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
