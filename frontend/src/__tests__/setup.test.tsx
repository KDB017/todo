// サンプル: コンポーネントのスモークテスト
// 実装が進んだらここにコンポーネントをimportして使う

describe('セットアップ確認', () => {
  it('vitestとtesting-libraryが動作する', () => {
    expect(1 + 1).toBe(2)
  })

  it('DOMレンダリングができる', () => {
    const div = document.createElement('div')
    div.textContent = 'Hello'
    document.body.appendChild(div)
    expect(document.body.textContent).toContain('Hello')
  })
})
