import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { setAuthButtons } from "@/redux/modules/auth/action";
import { updateCollapse } from "@/redux/modules/menu/action";
import { getAuthorButtons } from "@/api/modules/login";
import { connect } from "react-redux";
import LayoutMenu from "./components/Menu";
import LayoutHeader from "./components/Header";
import LayoutTabs from "./components/Tabs";
import LayoutFooter from "./components/Footer";
import "./index.less";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css"; // 导入默认样式

const LayoutIndex = (props: any) => {
	const { Sider, Content } = Layout;
	const { isCollapse, updateCollapse, setAuthButtons } = props;
	const [siderWidth, setSiderWidth] = useState<number>(220);

	const onResize = (e: any, { size }: { size: any }) => {
		setSiderWidth(size.width);
	};

	// 获取按钮权限列表
	const getAuthButtonsList = async () => {
		const { data } = await getAuthorButtons();
		setAuthButtons(data);
	};

	// 监听窗口大小变化
	const listeningWindow = () => {
		window.onresize = () => {
			return (() => {
				let screenWidth = document.body.clientWidth;
				if (!isCollapse && screenWidth < 1200) updateCollapse(true);
				if (!isCollapse && screenWidth > 1200) updateCollapse(false);
			})();
		};
	};

	useEffect(() => {
		listeningWindow();
		getAuthButtonsList();
	}, []);

	return (
		// 这里不用 Layout 组件原因是切换页面时样式会先错乱然后在正常显示，造成页面闪屏效果
		<section className="container">
			<Resizable
				width={siderWidth}
				height={0} // 高度不需要变化，因此设置为 0
				onResize={onResize}
				minConstraints={[200, 0]} // 最小宽度
				maxConstraints={[600, 0]} // 最大宽度
				handle={
					<span
						className="resizer-handle"
						style={{
							position: "absolute",
							right: 0,
							top: 0,
							bottom: 0,
							width: "5px",
							cursor: "col-resize"
							// backgroundColor: "#fff"
						}}
					/>
				}
			>
				<Sider trigger={null} collapsed={props.isCollapse} width={siderWidth} theme="dark">
					<LayoutMenu></LayoutMenu>
				</Sider>
			</Resizable>
			<Layout>
				<LayoutHeader></LayoutHeader>
				<LayoutTabs></LayoutTabs>
				<Content>
					<Outlet></Outlet>
				</Content>
				<LayoutFooter></LayoutFooter>
			</Layout>
		</section>
	);
};

const mapStateToProps = (state: any) => state.menu;
const mapDispatchToProps = { setAuthButtons, updateCollapse };
export default connect(mapStateToProps, mapDispatchToProps)(LayoutIndex);
