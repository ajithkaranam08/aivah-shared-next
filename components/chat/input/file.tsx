import React from 'react'

type Props = {}

const FileInput = (props: Props) => {
    return (
        <div className='hidden'>
            <input multiple type="file" className='sr-only' />
        </div>
    )
}

export default FileInput