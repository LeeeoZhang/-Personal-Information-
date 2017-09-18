
!function () {
    let animationList = {
        0: 'bounceInDown',
        1: 'slideInLeft',
        2: 'slideInRight',
        3: 'slideInLeft',
        4: 'rubberBand'
    }

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
                    if (targetIndex === 0) this.currentIndex = 0
                }).catch((error) => {
                    console.log(error)
                })
            })
            this.navEvent()
        }

        gotoSection (index) {
            let _this = this
            let targetIndex = index || this.targetIndex
            let currentSection = document.querySelector(`section:nth-of-type(${targetIndex+1})`)
            if (index === 0) targetIndex = 0
            return new Promise((resolve, reject) => {
                if (this.isAnimate) {
                    return reject()
                } else if (targetIndex < 0) {
                    return reject()
                } else if (targetIndex >= this.pageContainer.children.length) {
                    return reject()
                }
                addAnimation(targetIndex)
                this.isAnimate = true
                this.pageContainer.children[0].addEventListener('transitionend', function callback () {
                    removeAnimation(targetIndex)
                    addActive(targetIndex)
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
                    if (index === this.currentIndex) return
                    this.gotoSection(index).then((targetIndex) => {
                        this.isAnimate = false
                        this.currentIndex = targetIndex || this.targetIndex
                        if (targetIndex === 0) this.currentIndex = 0
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            })
        }
    }

    function addAnimation (targetIndex) {
        let content = document.querySelector(`section:nth-of-type(${targetIndex+1}) .content`)
        content.classList.add('animated', animationList[targetIndex])
        content.style.animationDelay = '.1s'
    }

    function removeAnimation (targetIndex) {
        let content = document.querySelector(`section:nth-of-type(${targetIndex+1}) .content`)
        content.classList.remove('animated',animationList[targetIndex])
        content.style.animationDelay = ''
    }

    function addActive(targetIndex){
        let liList = document.querySelectorAll('#navContainer>ul>li')
        let targetLi = liList[targetIndex]
        let siblings = targetLi.parentNode.children
        Array.prototype.forEach.call(siblings, function(item){
            item.classList.remove('active')
        })
        targetLi.classList.add('active')
    }
    new FullPage(document.querySelector('.page'), document.querySelector('#navContainer'))
}()


