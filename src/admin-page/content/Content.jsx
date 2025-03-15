const Content = ({ children }) => {
    return(
        <div className="flex-grow-1" style={{backgroundColor: '#E9F1FA', borderRadius: '5px'}}>
            { children }
        </div>
    )
}

export default Content