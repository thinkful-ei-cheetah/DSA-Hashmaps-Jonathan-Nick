class HashMapSC {
  constructor(initialCapacity = 8) {
    this.length = 0
    this._hashTable = []
    this._capacity = initialCapacity
    this._deleted = 0
    this.MAX_LOAD_RATIO = 0.5
    this.SIZE_RATIO = 3
  }

  // _Node = {data: data, next: next}

  // HM = [[{key: key, value: value, next: {key: key, value: value, next: null}}],,,,,,,,]

  get(key) {
    const index = this._findSlot(key)
    if (this._hashTable[index] === undefined) {
      //throw new Error('Key error')
      return
    } else {
      let currNode = this._hashTable[index]
      let result = []

      while (currNode !== null) {
        if (currNode.key === key) {
          result.push(currNode.value)
        }
        currNode = currNode.next
      }

      return result
    }
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity
    if (loadRatio > this.MAX_LOAD_RATIO) {
      this._resize(this._capacity * this.SIZE_RATIO)
    }
    //Find the slot where this key should be in
    const index = this._findSlot(key)
    let currNode = this._hashTable[index]

    const newNode = {
      key,
      value,
      next: null
    }

    if (currNode === undefined) {
      this._hashTable[index] = newNode

      this.length++
    } else {
      while (currNode.next !== null) {
        currNode = currNode.next
      }

      currNode.next = newNode
      this.length++
    }
  }

  delete(key) {
    const index = this._findSlot(key)
    let LL = this._hashTable[index]
    if (LL === undefined) {
      throw new Error('Key error')
    }
    
    while(LL !== undefined && LL.key === key) {
      LL = (LL.next === null ? undefined : LL.next)
      this.length--
    }

    if(LL === undefined) {
      this._hashTable[index] = LL
      return
    }

    let currNode = LL
    let prevNode = LL

    while(currNode !== null) {
      if(currNode.key === key) {
        prevNode.next = currNode.next
        this.length--
      }

      prevNode = currNode
      currNode = currNode.next
    }

    this._hashTable[index] = LL
  }

  _findSlot(key) {
    const hash = HashMapSC._hashString(key)
    return hash % this._capacity

  }

  _resize(size) {
    const oldSlots = this._hashTable
    this._capacity = size
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0
    this._deleted = 0
    this._hashTable = []

    for (let slot of oldSlots) {
      if (slot !== undefined) {
        while(slot !== null) {
          this.set(slot.key, slot.value)
          slot = slot.next
        }
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

module.exports = HashMapSC

const Lor = new HashMapSC()

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


console.log(Lor)
console.log(Lor.get('Hobbit'))
console.log(Lor.get('Wizard'))

Lor.delete('Wizard')
Lor.delete('Hobbit')

console.log(Lor)

