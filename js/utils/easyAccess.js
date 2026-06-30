//___________UPGRADE___________
function hasUpgrade(layer, id) {
	return ((player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString())) && !tmp[layer].deactivated)
}

function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect)
}

function getUpgradeCount(layer) {
    let count = new Decimal(0)

    for (let id in layers[layer].upgrades) {
        if (hasUpgrade(layer, id)) {
            count = count.add(1)
        }
    }

    return count
}

//___________MILESTONE___________
function hasMilestone(layer, id) {
	return ((player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString())) && !tmp[layer].deactivated)
}

function milestoneEffect(layer, id) {
	return (tmp[layer].milestones[id].effect)
}

function getMilestoneCount(layer) {
    let count = new Decimal(0)

    for (let id in layers[layer].milestones) {
        if (hasMilestone(layer, id)) {
            count = count.add(1)
        }
    }

    return count
}

//___________ACHIEVEMENT___________
function hasAchievement(layer, id) {
	return ((player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString())) && !tmp[layer].deactivated)
}

function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect)
}

//___________CHALLENGES___________
function hasChallenge(layer, id) {
	return ((player[layer].challenges[id]) && !tmp[layer].deactivated)
}

function maxedChallenge(layer, id) {
	return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated)
}

function challengeCompletions(layer, id) {
	return (player[layer].challenges[id])
}

function challengeEffect(layer, id) {
	return (tmp[layer].challenges[id].rewardEffect)
}

function canEnterChallenge(layer, id){
	return tmp[layer].challenges[id].canEnter ?? true
}

function canExitChallenge(layer, id){
	return tmp[layer].challenges[id].canExit ?? true
}

//___________BUYABLES___________
function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id])
}

function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
}

function hasBuyable(layer, id) {
	const amt = player[layer].buyables[id]
	const bought = (amt !== undefined) && ((amt && typeof amt.gt === 'function' && amt.gt(0)) || (amt > 0))
	return bought && !tmp[layer].deactivated
}

function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
}

function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect)
}

function buyableArrangement(layer, id, next, options = {}) { //options need to be put only if the value is changed (to do so --> {name: value})
    let { condition = null, bonusAmount = null, sign = 'x' } = options
	let baseAmount = getBuyableAmount(layer, id)
    let amount
    if (bonusAmount != null && bonusAmount.gt(0)) {
        let total = baseAmount.add(bonusAmount)
        amount = '<br><b>Amount:</b> ' + format(baseAmount) + ' + ' + format(bonusAmount)
    } else {
        amount = '<br><b>Amount:</b> ' + format(baseAmount)
    }

    let effect = '<b>Effect: '+sign+'</b>' + format(buyableEffect(layer, id))
    let nextb = '<br><b>Need ' + next + ' buyable to unlock the next one.</b>'

    if (condition != null || (condition == null && baseAmount >= next)) {
        nextb = ''
    }
    if (shiftDown) effect = '<b>Cost Formula:</b> ' + buyableCostFormula(layer, id)

    let data = '\n<br>' + effect + '\n<br>' + amount
    if (next != 0) data += '<br>' + nextb

    return data
}

function bulkBuyBuyable(layer, id, bulk) {
    let amount = getBuyableAmount(layer, id)
    let currency = player[layer].points
    
    let bought = 0
    let cost = layers[layer].buyables[id].cost(amount)
    
    while (currency.gte(cost) && bought < bulk) { // bulk is your cap
        currency = currency.sub(cost)
        amount = amount.add(1)
        bought++
        cost = layers[layer].buyables[id].cost(amount)
    }
    
    if (bought > 0) {
        setBuyableAmount(layer, id, getBuyableAmount(layer, id).add(bought))
        player[layer].points = currency
    }
}
//___________CLICKABLE___________
function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect)
}

//___________GRID___________
function getGridData(layer, id) {
	return (player[layer].grid[id])
}

function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
}