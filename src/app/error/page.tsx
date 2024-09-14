import SocialSignIn from '@/app/_components/social-sign-in'

const Index = () => {
  return (
    <main>
      <div className="mx-auto max-w-4xl p-5">
        <SocialSignIn />
      </div>
      <div className="mx-auto px-2 text-center">
        ログインに失敗しました。もう一度お試し下さい。
      </div>
    </main>
  )
}

export default Index
