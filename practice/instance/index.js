import Vue from 'vue'

const app = new Vue({
  // el: '#root',
  template: `
    <div>text: {{text}}</div>
  `,
  data: {
    text: 0
  }
})

app.$mount('#root')

setInterval(() => {
  app.text += 1
}, 1000)

console.log('app.$data', app.$data)
console.log('app.$props', app.$props)
console.log('app.$el', app.$el)
