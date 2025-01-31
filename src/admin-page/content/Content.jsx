const Content = ({ children }) => {
    return(
        <div className="flex-grow-1 p-0 m-0" style={{backgroundColor: '#E9F1FA', borderRadius: '5px'}}>
            { children }
        </div>
    )
}

export default Content