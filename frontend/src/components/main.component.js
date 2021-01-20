function MainPage({ level }) {

    return (
      <div className="main-wrapper">
        <div className="main-inner">
          <h2>Commander Song 2</h2>
          <h5>Adversarial attack against novel DeepSpeech ASR system</h5>
          <p><a href="http://proceedings.mlr.press/v48/amodei16.html" className="pantoneZOZ1a">Deep Speech 2</a> is a modern ASR system, which enables end-to-end training as spectrogram is directly utilized to generate predicted sentence. In this work, PGD (Projected gradient descent) and FGSM (Fast Gradient Sign Method) algorithms are implemented to conduct adversarial attack against this ASR system.</p>
          <h5>Adversarial examples</h5>
          <p>Please check the <a href="/example" className="pantoneZOZ1a">Examples</a> page</p>
          <h5>Generate your example by uploading wav file</h5>
          {(level === "guest")?(
            <p>Please <a href="/sign-in" className="pantoneZOZ1a">Login</a> first</p>
          ):(
            <>
            <p>Please go to <a href="/generate" className="pantoneZOZ1a">generate</a> to make your own adversarial examples</p>
            <h5>Check the results</h5>
            <p>Please go to <a href="/result" className="pantoneZOZ1a">results</a> to download generated adversarial examples and check their performance</p>
            </>
          )}
          {(level === "admin")?(
            <>
            <h5>Limitation</h5>
            <p>Admin has no limitation!</p>
            </>
          ):(
            <>
            <h5>Limitation</h5>
            <p>Normal member could only upload 5 times</p>
            </>
          )}

        </div>
      </div>
    )
  }

export default MainPage