import React from 'react'

function AuthImagePattern({ title, subtitle }) {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-200 p-12">

        <img src="./signup.svg" alt="signup image" />

      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-base-content/60">{subtitle}</p>
    </div>

  )
}

export default AuthImagePattern