import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let death = false;
let player;
let platforms;
let cursors;
let hazards;
let coins;
let endZone;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
// let widthText;
let treesLayer;
let cloudsLayer;

let resetBtn;

let skibi;
let toilet;
let jack;
let toiletDialogBox;
let toiletDialogVisible = false;

let toiletDialogIndex = 0;
let toiletDialog = [
    "Skibidi! <blijf spatie drukken>",
    "Skibii Toilet! <spatie>",
    "Bram, Bruh,",
    "zes zeven - een gegeven",
    "Jij kan raven zonder beven",
    "boulderen, 10 km wandelen,\njij zit vol leven",
    "Verzamel alle cadeautjes",
    "en je gedicht"
];

let jackDialogBox;
let jackDialogVisible = false;

let jackDialogIndex = 0;
let jackDialog = [
    "wat goe! die daggoe",
    "beste vrinden,",
    "nog wel samenleven uitvinden",
    "wezen racen",
    "verrek je bent knuffelgek",
    "Jack is door jou op z'n plek",
    "moet wel door zijn trek",
    "achter een hek",
    "in slaap hapt zijn bek",
    "stank voor dank",
    "dan toch maar van de bank",
    "dats het soort regels",
    "wats het hoort",
    "erbij",
    "nog steeds samen blij",
    "Jack en jij"
];


let skibiDialogBox;
let skibiDialogVisible = false;

let skibiDialogIndex = 0;
let skibidiDialog = [
    "meesterbouwer bram",
    "BAM",
    "die eifeltoren\nvan lego doet bekoren",
    "past dat nog op de kast",
    "je sjorde een concorde in orde",
    "ook al vliegt\ndat vliegtuig\nniet meer",
    "je vliegt\ndit jaar een keer",
    "geef ons het nakijken,\nzelfs de cockpit\nwist je  te bereiken",
    "priem daar",
    "zie maar:",
    "10 jaar",
    "jij volwassen heer,\nwas zelf in de weer",
    "een reis naar Londen",
    "tickets gevonden",
    "je weet\nwat je wilt eet(en)",
    "zelf hotelf geregeld\nvakantie bezegeld",
    "Koning"
];



function preload() {
    this.load.image('sky', '/assets/clouds-h.png');
    this.load.image('trees', '/assets/trees-h.png');
    this.load.image('roof', '/assets/roof.png'); // naadloze dakafbeelding
    this.load.image('chimney', '/assets/roofchimney.png'); // losse schoorsteen
    this.load.image('dakpan', '/assets/dakpan.png'); // naadloze dakafbeelding
    this.load.image('dakblad', '/assets/dakblad.png'); // naadloze dakafbeelding
    this.load.image('muur', '/assets/muur.png'); // losse schoorsteen
    this.load.image('skibidi', '/assets/Skibidi_Toilet.svg'); // losse schoorsteen
    this.load.image('toilet', '/assets/Toilet.svg'); // losse schoorsteen
    this.load.image('jack', '/assets/jack.png'); // losse schoorsteen

    this.load.atlas('sinterklaas', 'assets/sinterklaas_spritesheet_pixelated.png', 'assets/sinterklaas_spritesheet_pixelated.json');

    this.load.image('coin', '/assets/cadeau.png'); // coin
    //
    // this.load.spritesheet('dude',
    //     'https://labs.phaser.io/assets/sprites/dude.png',
    //     { frameWidth: 32, frameHeight: 48 }
    // );
}

function create() {
    // Achtergrond
    cloudsLayer = this.add.tileSprite(0, 0, 4000, 600, 'sky').setOrigin(0).setScrollFactor(0);

    treesLayer = this.add.tileSprite(0, 460, 800, 600, 'trees').setOrigin(0).setScrollFactor(0);

    player = this.physics.add.sprite(100, 450, 'sinterklaas', 'frame_7');
    player.setBounce(0.2);
    player.setScale(2, 2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('sinterklaas', { start: 0, end: 5, prefix: 'frame_' }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [{ key: 'sinterklaas', frame: 'frame_3' }],
        frameRate: 1
    });

    this.anims.create({
        key: 'jump',
        frames: [{ key: 'sinterklaas', frame: 'frame_7' }],
        frameRate: 1
    });

    // Stel wereldgrenzen in
    this.physics.world.setBounds(0, 0, 4000, 600);

    // Platforms (daken)
    platforms = this.physics.add.staticGroup();
    hazards = this.physics.add.staticGroup(); // gevaarlijke punten

    let x = 0;

    const widths = [[150, 100], [300, 100], [300, 100], [150, 180], [150, 100], [300, 200], [300, 100], [150, 100], [150, 300], [300, 150], [100, 150], [300, 300], [150, 100]];

    for (const widthgap of widths) {
        // let width = Phaser.Math.Between(150, 300);
        let width = widthgap[0];
        let gap = widthgap[1];
        let roofPlatform = this.add.tileSprite(x + width / 2, 550, width, 50, 'dakpan');
        this.physics.add.existing(roofPlatform, true);
        platforms.add(roofPlatform);

        // Voeg een gat toe en plaats een gevaarlijk punt in het midden van het gat
        // let gap = Phaser.Math.Between(100, 200);
        let hazard = this.add.tileSprite(x + width + gap / 2, 570, gap, 22, 'roof');
        hazard.setTint(0xff0000); // rood om gevaar aan te geven
        this.physics.add.existing(hazard, true);
        hazards.add(hazard);
        x += width + gap;
    }

    x = 0;

    const widths2 = [[0, 500], [300, 200], [300, 100], [150, 100], [150, 500], [300, 500], [300, 100], [150, 100], [150, 300], [300, 150], [100, 150], [300, 300], [150, 100]];

    for (const widthgap of widths2) {
        let width = widthgap[0];
        let gap = widthgap[1];
        let roofPlatform = this.add.tileSprite(x + width / 2, 320, width, 50, 'dakpan');
        this.physics.add.existing(roofPlatform, true);
        platforms.add(roofPlatform);

        // Voeg een gat toe en plaats een gevaarlijk punt in het midden van het gat
        x += width + gap;
    }
    x = 0;

    const widths3 = [[0, 1850], [100, 200], [100, 400], [300, 1800], [300, 1800]];

    for (const widthgap of widths3) {
        let width = widthgap[0];
        let gap = widthgap[1];
        let roofPlatform = this.add.tileSprite(x + width / 2, 420, width, 50, 'dakblad');
        this.physics.add.existing(roofPlatform, true);
        platforms.add(roofPlatform);

        // Voeg een gat toe en plaats een gevaarlijk punt in het midden van het gat
        x += width + gap;
    }


    const muurPlatform = this.add.tileSprite(0, 605, 12000, 64, 'muur');
    this.physics.add.existing(muurPlatform, true); // static body

    this.physics.add.collider(player, platforms);

    // Coins verspreid
    coins = this.physics.add.group();
    for (let i = 300; i < 2000; i += Phaser.Math.Between(150, 250)) {
        coins.create(i, Phaser.Math.Between(100, 400), 'coin');
    }

// Maak coins kleiner
    coins.children.iterate(function (child) {
        child.setScale(0.5); // halve grootte
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
    });

    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.overlap(player, hazards, hitHazard, null, this);

    // Camera volgt speler
    this.cameras.main.setBounds(0, 0, 4000, 600);
    this.cameras.main.startFollow(player);

    // UI
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
    livesText = this.add.text(16, 50, 'Levens: 3', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
    // widthText = this.add.text(16, 95, 'Width: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);


// Eindpunt (bijv. vlag)
    endZone = this.physics.add.staticImage(3950, 500, 'jack'); // tijdelijk coin als vlag
    endZone.setTint(0x00ff00); // groen om te onderscheiden
    this.physics.add.overlap(player, endZone, reachEnd, null, this);

    // this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();


    // skibi toevoegen
    skibi = this.physics.add.image(1280, 200, 'skibidi'); // gebruik een frame uit jouw atlas
    skibi.setScale(0.03);

    toilet = this.physics.add.image(380, 400, 'toilet'); // gebruik een frame uit jouw atlas
    toilet.setScale(0.03);

    jack = this.physics.add.image(2400, 200, 'jack'); // gebruik een frame uit jouw atlas
    jack.setScale(0.5);

    // Collision tussen speler en skibi
    // this.physics.add.collider(player, skibi);
    this.physics.add.collider(skibi, platforms);
    this.physics.add.collider(toilet, platforms);
    this.physics.add.collider(jack, platforms);

    // Dialoogbox (onzichtbaar bij start)
    skibiDialogBox = this.add.text(300, 300, 'Skibidi! <druk spatie>', {
        fontSize: '24px',
        fill: '#ffc200',
        backgroundColor: '#350101'
    }).setScrollFactor(0).setVisible(false);

    toiletDialogBox = this.add.text(300, 300, 'Skibidi! <druk spatie>', {
        fontSize: '24px',
        fill: '#ffc200',
        backgroundColor: '#350101'
    }).setScrollFactor(0).setVisible(false);

    jackDialogBox = this.add.text(300, 300, 'Skibidi! <druk spatie>', {
        fontSize: '24px',
        fill: '#ffc200',
        backgroundColor: '#350101'
    }).setScrollFactor(0).setVisible(false);


    resetBtn = createResetButton();
    hideResetButton(); // start onzichtbaar


    cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function hitHazard(player, hazard) {
    lives--;
    livesText.setText('Levens: ' + lives);
    player.setPosition(100, 450); // terug naar start
    if (lives <= 0) {
        // this.physics.pause();
        death = true;
        player.setTint(0xff0000);
        scoreText.setText('GAME OVER');
        showResetButton();
    }
}

function reachEnd(player, endZone) {
    this.physics.pause();
    player.setTint(0x00ff00);
    scoreText.setText('Gewonnen! open je cadeau & chapeau!');
}

function update() {
    // widthText.setText('Width: ' + player.x);
    if (death) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('walk', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('walk', true);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
        player.anims.play('idle');
    }

    if (cursors.up.isDown) {
        player.anims.play('jump');
        if (player.body.blocked.down) {
            player.setVelocityY(-380);
            player.anims.play('jump');

        }
        player.anims.play('jump');
    }

    const jackDistance = Phaser.Math.Distance.Between(player.x, player.y, jack.x, jack.y);
    if (jackDistance > 100) {
        jackDialogVisible = false;
        jackDialogBox.setVisible(jackDialogVisible);
    }
    else {
        jackDialogVisible = true;
        jackDialogBox.setText(jackDialog[jackDialogIndex]);
        jackDialogBox.setVisible(true);
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            jackDialogIndex++;
            if (jackDialogIndex < jackDialog.length) {
                jackDialogBox.setText(jackDialog[jackDialogIndex]);
            } else {
                jackDialogBox.setVisible(false);
                jackDialogVisible = false;
            }
        }
    }

    const skibiDistance = Phaser.Math.Distance.Between(player.x, player.y, skibi.x, skibi.y);
    if (skibiDistance > 100) {
        skibiDialogVisible = false;
        skibiDialogBox.setVisible(skibiDialogVisible);
    }
    else {
        skibiDialogVisible = true;
        skibiDialogBox.setText(skibidiDialog[skibiDialogIndex]);
        skibiDialogBox.setVisible(true);
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            skibiDialogIndex++;
            if (skibiDialogIndex < skibidiDialog.length) {
                skibiDialogBox.setText(skibidiDialog[skibiDialogIndex]);
            } else {
                skibiDialogBox.setVisible(false);
                skibiDialogVisible = false;
            }
        }
    }

    const toiletDistance = Phaser.Math.Distance.Between(player.x, player.y, toilet.x, toilet.y);
    if (toiletDistance > 100) {
        toiletDialogVisible = false;
        toiletDialogBox.setVisible(toiletDialogVisible);
    }
    else {
        toiletDialogVisible = true;
        toiletDialogBox.setText(toiletDialog[toiletDialogIndex]);
        toiletDialogBox.setVisible(true);
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            toiletDialogIndex++;
            if (toiletDialogIndex < toiletDialog.length) {
                toiletDialogBox.setText(toiletDialog[toiletDialogIndex]);
            } else {
                toiletDialogBox.setVisible(false);
                toiletDialogVisible = false;
            }
        }
    }

    treesLayer.tilePositionX = this.cameras.main.scrollX * 0.5;
    cloudsLayer.tilePositionX = this.cameras.main.scrollX * 0.3;

    // // Check game-over
    // if (lives <= 0) {
    //     // this.physics.pause();
    //     player.setTint(0xff0000);
    //     // player.anims.play('turn');
    //     scoreText.setText('GAME OVER');
    //     // this.physics.pause();
    //     // player.setTint(0xff0000);
    //     // player.anims.stop();
    //
    //     // Toon reset-knop
    //     showResetButton();
    // }

}


function createResetButton() {
    // Maak een HTML-knop en positioneer die boven het canvas
    const btn = document.createElement('button');
    btn.textContent = 'Opnieuw starten';
    btn.style.position = 'absolute';
    btn.style.left = '50%';
    btn.style.top = '20px';
    btn.style.transform = 'translateX(-50%)';
    btn.style.padding = '8px 12px';
    btn.style.fontSize = '16px';
    btn.style.zIndex = '1000';
    btn.style.display = 'none';

    document.body.appendChild(btn);
    btn.addEventListener('click', () => restartScene());
    return btn;
}

function showResetButton() {
    resetBtn.style.display = 'block';
}

function hideResetButton() {
    resetBtn.style.display = 'none';
}


function restartScene() {
    // Herstart de scene (reset alle game-state automatisch als je alles in create() initialiseert)
    score = 0;
    lives = 3;
    toiletDialogVisible = false;
    toiletDialogIndex = 0;
    skibiDialogVisible = false;
    skibiDialogIndex = 0;
    jackDialogVisible = false;
    jackDialogIndex = 0;
    player.setPosition(100, 450); // terug naar start
    scoreText.setText('Score: ' + score);
    livesText.setText('Levens: ' + lives);
    player.clearTint();
    // player.anims.resume();
    hideResetButton();
    death = false;
    // this.physics.resume();
}
