class Explorer {
    constructor(id) {
      this.id = id
    }

    toString() {
        return JSON.stringify({
          id: this.id
        })
      }
    
}

module.exports =  {Explorer};