class HashMap {
  constructor(initialCapacity = 8) {
    this.length = 0
    this._hashTable = []
    this._capacity = initialCapacity
    this._deleted = 0
    this.MAX_LOAD_RATIO = 0.5
    this.SIZE_RATIO = 3
  }

  get(key) {
    const index = this._findSlot(key)
    if (this._hashTable[index] === undefined) {
      //throw new Error('Key error')
      return;
    }
    return this._hashTable[index].value
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity
    if (loadRatio > this.MAX_LOAD_RATIO) {
      this._resize(this._capacity * this.SIZE_RATIO)
    }
    //Find the slot where this key should be in
    const index = this._findSlot(key)

    if (!this._hashTable[index]) {
      this.length++
    }
    this._hashTable[index] = {
      key,
      value,
      DELETED: false
    }
  }

  delete(key) {
    const index = this._findSlot(key)
    const slot = this._hashTable[index]
    if (slot === undefined) {
      throw new Error('Key error')
    }
    slot.DELETED = true
    this.length--
    this._deleted++
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key)
    const start = hash % this._capacity

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity
      const slot = this._hashTable[index]
      if (slot === undefined || (slot.key === key && !slot.DELETED)) {
        return index
      }
    }
  }

  _resize(size) {
    const oldSlots = this._hashTable
    this._capacity = size
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0
    this._deleted = 0
    this._hashTable = []

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.DELETED) {
        this.set(slot.key, slot.value)
      }
    }
  }

  static _hashString(string) {
    let hash = 5381
    for (let i = 0; i < string.length; i++) {
      //Bitwise left shift with 5 0s - this would be similar to
      //hash*31, 31 being the decent prime number
      //but bit shifting is a faster way to do this
      //tradeoff is understandability
      hash = (hash << 5) + hash + string.charCodeAt(i)
      //converting hash to a 32 bit integer
      hash = hash & hash
    }
    //making sure has is unsigned - meaning non-negtive number.
    return hash >>> 0
  }
}

module.exports = HashMap

const Lor = new HashMap()

Lor.set('Hobbit', 'Bilbo')
Lor.set('Hobbit', 'Frodo')
Lor.set('Wizard', 'Gandolf')
Lor.set('Human', 'Aragon')
Lor.set('Elf', 'Legolas')
Lor.set('Maiar', 'The Necromancer')
Lor.set('Maiar', 'Sauron')
Lor.set('RingBearer', 'Gollum')
Lor.set('LadyOfLight', 'Galadriel')
Lor.set('HalfElven', 'Arwen')
Lor.set('Ent', 'Treebeard')

console.log(Lor.get('Hobbit'))


// 2. WhatDoesThisDo

/* Since the key's are identical, we expect the values to be overwritten
 * Such that...
 * console.log(map1.get(str1)) should return 20 and
 * console.log(map2.get(str2)) should return 10
 */

const WhatDoesThisDo = function() {
  let str1 = 'Hello World.'
  let str2 = 'Hello World.'
  let map1 = new HashMap()
  map1.set(str1, 10)
  map1.set(str2, 20)
  let map2 = new HashMap()
  let str3 = str1
  let str4 = str2
  map2.set(str3, 20)
  map2.set(str4, 10)

  console.log(map1.get(str1))
  console.log(map2.get(str3))
}

WhatDoesThisDo()

// 3. Demonstrate understanding of Hash maps

/*  1)
    keys = [10, 22, 31, 4, 15, 28, 17, 88, 59]
    m = new HashMap() where m.length = 11
    hashFn = k % m

    10 % 11 = 10 [ 22,88 , , ,4 ,15 ,28 ,17 ,9,10,59 ]
    22 % 11 = 0  
    31 % 11 = 9
    4  % 11 = 4
    15 % 11 = 4
    28 % 11 = 6
    17 & 11 = 6
    88 % 11 = 0
    59 % 11 = 4

    2)
    keys = [5, 28, 19, 15, 20, 33, 12, 17, 10]
    m.length = 9

    5  % 9 = 5  [][28->19->10][20][12][][9][15->33][][17]
    28 % 9 = 1
    19 % 9 = 1
    15 % 9 = 6
    20 % 9 = 2
    33 % 9 = 6
    12 % 9 = 3
    17 % 9 = 8
    10 % 9 = 1 

*/


// 4

const str = "google all that you think can think of";
const Hash = new HashMap();
let to_return = '';
str.split('').map(letters => {

       if (Hash.get(letters)===undefined)
       {
            to_return += letters;
            Hash.set(letters, 1);
       }

})


// 5

// acecarr TRUE b/c acecarr -> racecar aa aaaa aaab
// const added (++)
// month FALSE b/c month != palindrome

// s.length is EVEN then if HM.length = s.length/2
// s.length is ODD
// [{a: 2}, {c: 2}, {e: 1}, ...]

// a.value % 2 != 0 return false

function canPalindrome(s) {
    const map = new HashMap()

    s.split('').map(char => {
        if(map.get(char) === undefined) {
            map.set(char, 1)
        } else {
            map.delete(char)
        }
    })
    
    if(s.length % 2 === 0 ) {
        return map.length === 0
    } else {
        return map.length === 1
    }
}

console.log(canPalindrome('acecarr'))
console.log(canPalindrome('month'))