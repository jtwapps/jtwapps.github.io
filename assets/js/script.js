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

$("form :input").attr("autocomplete", "off");

// Logic to make this a MultiStep Form
let curStep = 0;
$('#sub-but').hide();
$('#back-but').hide();
for (i = 2; i <= 12; i++) {
    let stepNum = '#step' + i.toString();
    $(stepNum).hide();
}

function nextStep() {
    if (curStep > 0) {
        $('#back-but').show();
    }

    if (curStep >= 12) {
        console.log('cannot advance past final page')
        return
    }

    // Remove the circle from the previous number and make it (and its dash) completed
    let oldId = '#' + curStep.toString();
    $(oldId).removeClass('curstep');
    $(oldId).addClass('stepnumber-completed');
    let dashId = '#d' + curStep.toString();
    $(dashId).addClass('stepnumber-completed');

    // Hide old step content
    let oldStepId = '#step' + curStep.toString();
    $(oldStepId).hide();

    curStep += 1;

    // Add the circle around the next step
    let numId = '#' + curStep.toString();
    $(numId).addClass('curstep');

    // Show new step content
    let newStepId = '#step' + curStep.toString();
    $(newStepId).show();

    // If it is the final step, make the 12 look completed and remove the next button
    if (curStep == 12) {
        console.log('limit reached');
        $(numId).removeClass('curstep').addClass('stepnumber-completed');
    }
}

nextStep();

function backStep() {
    if (curStep == 1) {
        console.log("cannot go below 1");
        return
    }

    // Remove visibility of current content
    let oldId = '#' + curStep.toString();
    $(oldId).removeClass('curstep');
    let oldStep = '#step' + curStep.toString();
    $(oldStep).hide()

    curStep -= 1;

    // Show previous card content
    let curId = '#' + curStep.toString();
    $(curId).addClass('curstep');
    let newStep = '#step' + curStep.toString();
    $(newStep).show()
}


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
    $('#delivery-method').text(e.target.value);
    createFloralSummary();
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
    let delivery = 0;
    if ($('#delivery-method').text().substring(0,4) != 'Free') {
        delivery = Math.max(100, 0.1 * flowerTotal);
    }

    flowerTotal += delivery;

    let taxes = 0.06 * flowerTotal;

    let grandTotal = taxes + flowerTotal;

    let delivTail = `<tr><td>Delivery</td><td></td><td></td><td id="dlv">$${delivery.toFixed(2)}</td></tr>`;
    let taxesTail = `<tr><td>MD Sales Tax (6%)</td><td></td><td></td><td id="txs">$${taxes.toFixed(2)}</td></tr>`;
    let tableTail = `<tr><td></td><td></td><td>Total</td><td id="total">$${grandTotal.toFixed(2)}</td></tr></tbody></table>`;

    

    return tableHead + tableBody + delivTail + taxesTail + tableTail;
}

function createFloralSummary() {
    let outputArr = [];
    for (const [key, value] of priceMap.entries()) {
        if (priceMap.has(key) && flowersMap.get(key) && flowersMap.get(key) > 0) {
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

// Additional Needs
let curNeeds = [];

function createNeedsHTML(needs) {
    let output = '';
    for (i = 0; i < needs.length; i++) {
        let temp = '<li>' + needs[i] + '</li>'
        output += temp
    }

    return '<ul>' + output + '</ul>'
}

function createAddtlNeedsSummary() {
    let addtlNeeds = [
        'candles', 'arches', 'elevated-centerpieces', 'installations', 'setup',
        'mockup', 'breakdown',
    ]

    let prettyName = {
        'candles': 'Candles',
        'arches': 'Arches',
        'elevated-centerpieces': 'Elevated Centerpieces',
        'installations': 'Installations',
        'setup': 'Setup',
        'mockup': 'Mockup',
        'breakdown': 'Breakdown',
    }

    let confirmedNeeds = [];

    for (i = 0; i < addtlNeeds.length; i++) {
        let j = addtlNeeds[i];
        let isChecked = $('#'+j).is(':checked');
        if (isChecked) {
            confirmedNeeds.push(prettyName[j]);
        }
    }

    curNeeds = confirmedNeeds;

    let x = createNeedsHTML(confirmedNeeds);
    $('#adtl-needs').html(x || '');
}

$('input:checkbox').on('change', function(e) {
    createAddtlNeedsSummary();
});

// Create email
function flowersForEmail() {
    let outputArr = ["Qty Item, Subtotal\n"];
    for (const [key, value] of priceMap.entries()) {
        if (priceMap.has(key) && flowersMap.get(key) && flowersMap.get(key) > 0) {
            let q = flowersMap.get(key);

            let priceStr = '$' + q*parseInt(value).toString();
            
            let qStr = q.toString();
            
            outputArr.push(`${qStr}x ${key}, ${priceStr}\n`);
        }
    }
    let output = outputArr.join('');
    return output 
}

function mailer() {
    let coupleName = $('#coupleName').val();
    let date = $('#wedDate').val();
    let location = $('#wedLoc').val();
    let emailAddr = $('#emailAddress').val();
    let vision = [
        $('#word1').val(),
        $('#word2').val(),
        $('#word3').val(),
    ];
    let colors = [
        $('#color1').val(),
        $('#color2').val(),
        $('#color3').val(),
    ];

    let d;
    if ($('#delivery-method').text().substring(0,4) == 'Free') {
        d = 'No';
    } else if ($('#delivery-method').text().substring(0,4) == 'Drop') {
        d = 'Yes';
    } else {
        d = 'Unsure';
    }


    let body = `Quote for ${coupleName}:

Date: ${date}
Location: ${location}
Email Address: ${emailAddr}

Color Palettes: ${paletteOrder.join(' ')}

Vision: ${vision.join(' ')}
Preferred Colors: ${colors.join(' ')}

Delivery: ${d}, ${$('#dlv').text()}

Flowers:
${flowersForEmail()}
Taxes: ${$('#txs').text()}

Est Total: ${$('#total').text()}

Additional Needs: ${curNeeds}`;

    let mailtoString = `mailto:violetfloraldesigns+wildviolets@gmail.com?subject=WILD VIOLETS Inquiry for ${coupleName}&body=${body}`

    window.open(encodeURI(mailtoString), '_self');
}


// in case any fields are cached
var elements = document.getElementsByTagName("input");
for (var ii=0; ii < elements.length; ii++) {
  if (elements[ii].type == "text" || elements[ii].type == "email") {
    elements[ii].value = "";
  } else if (elements[ii].type == "checkbox") {
    elements[ii].checked = false;
  } else if (elements[ii].type == "radio") {
    elements[ii].checked = false;
  } else if (elements[ii].type == "number") {
      elements[ii].value = 0;
  }
}
$('#pickup').prop('checked', true);
createFloralSummary();
createAddtlNeedsSummary();
