const renderConclusion = self => {
    const { content } = self.state

    return (
        <div className="item multi-function-item">
            <div className="item-description">策略结论</div>
            <div className="item-container flex-start-center">
                <textarea className="content-textarea fiex-rest" type="text"
                    placeholder="请输入结论"
                    value={content}
                    style={{ height: 180 }}
                    onChange={({ target: { value } }) => self.setState({ content: value })}
                ></textarea>
            </div>
        </div>
    )

}

export default renderConclusion