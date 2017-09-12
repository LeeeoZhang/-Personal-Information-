!function () {
    class FullPage {
        constructor (pageContainer, navContainer, duration) {
            this.pageContainer = pageContainer
            this.duration = duration
            this.navContainer = navContainer
            this.currentIndex = 0
            this.isAnimate = false
            this.targetIndex = 0
            this.bindEvents()
        }

        bindEvents () {
            this.pageContainer.addEventListener('wheel', (e) => {
                this.targetIndex = this.currentIndex + (e.deltaY > 0 ? 1 : -1)
                this.gotoSection().then((targetIndex) => {
                    this.isAnimate = false
                    this.currentIndex = targetIndex || this.targetIndex
                    if(targetIndex === 0) this.currentIndex = 0
                    console.log(this.currentIndex, this.targetIndex)
                }).catch((error) => {
                    console.log(error)
                })
            })
            this.navEvent()
        }

        gotoSection (index) {
            let _this = this
            let targetIndex = index || this.targetIndex
            if(index === 0) targetIndex = 0
            return new Promise((resolve, reject) => {
                if (this.isAnimate) {
                    return reject()
                } else if (targetIndex < 0) {
                    return reject()
                } else if (targetIndex >= this.pageContainer.children.length) {
                    return reject()
                }
                this.isAnimate = true
                this.pageContainer.children[0].addEventListener('transitionend', function callback () {
                    _this.pageContainer.children[0].removeEventListener('transitionend', callback)
                    resolve(targetIndex)
                })
                for (let i = 0; i < this.pageContainer.children.length; i++) {
                    this.pageContainer.children[i].style.transform = `translateY(-${100 * targetIndex}%)`
                }
            })
        }

        navEvent () {
            this.navContainer.addEventListener('click', (event) => {
                if (event.target.nodeName.toLowerCase() === 'li') {
                    let target = event.target
                    let navList = this.navContainer.querySelectorAll('ul>li')
                    let index = [].indexOf.call(navList, target)
                    if(index === this.currentIndex) return
                    this.gotoSection(index).then((targetIndex) => {
                        this.isAnimate = false
                        this.currentIndex = targetIndex || this.targetIndex
                        if(targetIndex === 0) this.currentIndex = 0
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            })
        }
    }

    new FullPage(document.querySelector('.page'), document.querySelector('#navContainer'))
}()


