// SET PRICES HERE
let priceMap = new Map();
let pricesArr = [
    ['Lush Bridal Bouquet', 275],
    ['Petite Bridal Bouquet', 195],
    ['Lush Attendant Bouquet', 150],
    ['Classic Attendant Bouquet', 125],
    ['Mini Attendant Bouquet', 95],
    ['Floral Bracelet', 45],
    ['Elaborate Boutonniere', 28],
    ['Simple Boutonniere', 20],
    ['Adult Floral Crown', 75],
    ['Child Floral Crown', 48],
    ['Floral Comb', 48],
    ['Loose Styling Stems (dozens)', 48],
    ['Lush Vase Centerpiece', 240],
    ['Classic Vase Centerpiece', 160],
    ['Petite Vase Centerpiece', 95],
    ['Budvase - Small', 20],
    ['Budvase - Medium', 30]
];

for (i = 0; i < pricesArr.length; i++) {
    priceMap.set(pricesArr[i][0], pricesArr[i][1])
}


//Wizard Init

$("#wizard").steps({
    headerTag: "h3",
    bodyTag: "section",
    transitionEffect: "none",
    stepsOrientation: "vertical",
    titleTemplate: '<span class="number">#index#</span>'
});

//Form control

// COUPLES BASIC INFO
$('#coupleName').on('change', function(e) {
    $('#enteredCoupleName').text(e.target.value || 'Violet Florals');
});

$('#wedDate').on('change', function(e) {
    $('#enteredWedDate').text(e.target.value || 'August 18th, 1920');
});

$('#wedLoc').on('change', function(e) {
    $('#enteredWedLoc').text(e.target.value || '10 Downing Street');
});

$('#emailAddress').on('change', function(e) {
    $('#enteredEmailAddress').text(e.target.value || '');
});

// COLOR PALETTES
let paletteMap = new Map();
let paletteOrder = [];
let paletteCount = 0;

function selectPalette(colorPalette) {
    paletteMap.set(colorPalette, true);
    paletteOrder.push(colorPalette);
    paletteCount += 1;
}

function generatePaletteText(i) {
    if (i > paletteOrder.length - 1) {
        return 'None';
    }

    var nameArr = paletteOrder[i].split('-');
    for (let j = 0; j < nameArr.length; j++) {
        nameArr[j] = nameArr[j][0].toUpperCase() + nameArr[j].substr(1);
    }

    var name = nameArr.join(" ");
    var imgStr = '<img src="assets/images/' + paletteOrder[i] + '.png" class="img-fluid rounded" alt="">';
    var final = "<div class='row'><div class='col'><p> " + name + " </p></div><div class='col'>" + imgStr + "</div></div>";
    return final;
}

$('.palette').on('change', function(e) {
    let colorPalette = e.target.id;
    if (paletteMap.has(colorPalette)) {
        paletteMap.delete(colorPalette);
        paletteCount -= 1;
        let i = paletteOrder.indexOf(colorPalette);
        paletteOrder.splice(i, 1);
    } else if (paletteCount >= 2) {
        let toRemove = paletteOrder.shift();
        paletteMap.delete(toRemove);
        paletteCount -= 1;
        document.getElementById(toRemove).checked = false;
        selectPalette(colorPalette);
    } else {
        selectPalette(colorPalette);
    }
    let palette1 = generatePaletteText(0);
    let palette2 = generatePaletteText(1);
    $('#colorPalette1').html(palette1 || 'None');
    $('#colorPalette2').html(palette2 || 'None');
})

// INSPIRATION
$('#word1').on('change', function(e) {
    $('#enteredWord1').text(e.target.value || '-')
})

$('#word2').on('change', function(e) {
    $('#enteredWord2').text(e.target.value || '-')
})

$('#word3').on('change', function(e) {
    $('#enteredWord3').text(e.target.value || '-')
})

$('#color1').on('change', function(e) {
    $('#enteredColor1').text(e.target.value || '-')
})

$('#color2').on('change', function(e) {
    $('#enteredColor2').text(e.target.value || '-')
})

$('#color3').on('change', function(e) {
    $('#enteredColor3').text(e.target.value || '-')
})

// DELIVERY METHOD
$('.deliv').on('change', function(e) {
    $('#delivery-method').text(e.target.value)
})

// FLOWERS
let flowersMap = new Map();

function floralSummaryHTML(a) {
    let flowerTotal = 0;

    let tableHead = `<table class="table"><thead><tr>
    <th scope="col">Item</th>
    <th scope="col">Price</th>
    <th scope="col">Quantity</th>
    <th scope="col">Subtotal</th>
    </tr>
    </thead>
    <tbody>
    `;

    let tableBody = '';

    for (i = 0; i < a.length; i++) {
        let temp = `<tr>
        <td>${a[i][0]}</td>
        <td>$${a[i][2]}</td>
        <td>${a[i][1]}</td>
        <td>$${a[i][3]}</td>
        </tr>
        `
        flowerTotal += a[i][3];

        tableBody += temp;
    }

    let tableTail = `<tr><td></td><td></td><td>Subtotal</td><td>$${flowerTotal}</td></tbody></table>`;

    

    return tableHead + tableBody + tableTail;
}

function createFloralSummary() {
    let outputArr = [];
    for (const [key, value] of priceMap.entries()) {
        if (priceMap.has(key) && flowersMap.get(key) && flowersMap.get(key) > 0) {
            console.log(key, flowersMap.get(key))
            let q = flowersMap.get(key);
            outputArr.push([key, q, value, q*parseInt(value)])
        }
    }
    let x = floralSummaryHTML(outputArr);
    $('#floral-summary').html(x || '');
}

$('#lush-bridal').on('change', function(e) {
    flowersMap.set('Lush Bridal Bouquet', e.target.value);
    createFloralSummary();
})

$('#petite-bridal').on('change', function(e) {
    flowersMap.set('Petite Bridal Bouquet', e.target.value);
    createFloralSummary();
})

$('#lush-att').on('change', function(e) {
    flowersMap.set('Lush Attendant Bouquet', e.target.value);
    createFloralSummary();
})

$('#classic-att').on('change', function(e) {
    flowersMap.set('Classic Attendant Bouquet', e.target.value);
    createFloralSummary();
})

$('#mini-att').on('change', function(e) {
    flowersMap.set('Mini Attendant Bouquet', e.target.value);
    createFloralSummary();
})

$('#corsage').on('change', function(e) {
    flowersMap.set('Floral Bracelet', e.target.value);
    createFloralSummary();
})

$('#elab-bout').on('change', function(e) {
    flowersMap.set('Elaborate Boutonniere', e.target.value);
    createFloralSummary();
})

$('#simp-bout').on('change', function(e) {
    flowersMap.set('Simple Boutonniere', e.target.value);
    createFloralSummary();
})

$('#adult-crown').on('change', function(e) {
    flowersMap.set('Adult Floral Crown', e.target.value);
    createFloralSummary();
})

$('#child-crown').on('change', function(e) {
    flowersMap.set('Child Floral Crown', e.target.value);
    createFloralSummary();
})

$('#comb').on('change', function(e) {
    flowersMap.set('Floral Comb', e.target.value);
    createFloralSummary();
})

$('#stems').on('change', function(e) {
    flowersMap.set('Loose Styling Stems (dozens)', e.target.value);
    createFloralSummary();
})

$('#lush-center').on('change', function(e) {
    flowersMap.set('Lush Vase Centerpiece', e.target.value);
    createFloralSummary();
})

$('#classic-center').on('change', function(e) {
    flowersMap.set('Classic Vase Centerpiece', e.target.value);
    createFloralSummary();
})

$('#petite-center').on('change', function(e) {
    flowersMap.set('Petite Vase Centerpiece', e.target.value);
    createFloralSummary();
})

$('#small-bud').on('change', function(e) {
    flowersMap.set('Budvase - Small', e.target.value);
    createFloralSummary();
})

$('#med-bud').on('change', function(e) {
    flowersMap.set('Budvase - Medium', e.target.value);
    createFloralSummary();
})