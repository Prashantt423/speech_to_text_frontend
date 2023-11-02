import "./sidebar.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
const options = [
  {
    title: "Home",
    icon: <HomeOutlinedIcon />,
    isActive: true,
  },
  {
    title: "All files",
    icon: <InsertDriveFileIcon />,
    isActive: false,
  },
  {
    title: "Saved",
    icon: <BookmarkBorderIcon />,
    isActive: false,
  },
  {
    title: "Integrations",
    icon: <ShareOutlinedIcon />,
    isActive: false,
  },
  {
    title: "Trash",
    icon: <DeleteOutlinedIcon />,
    isActive: false,
  },
  {
    title: "Settings",
    icon: <SettingsOutlinedIcon />,
    isActive: false,
  },
  {
    title: "Help and Support",
    icon: <HelpOutlineOutlinedIcon />,
    isActive: false,
  },
];

function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <h3
          style={{
            color: "blue",
          }}
        >
          ABC firm
        </h3>
        {options.map((d, i) => (
          <div
            className="option"
            style={
              d.isActive
                ? {
                    borderRadius: "4px",
                    border: "1px solid #E0EDFF",
                    background: "#E0EDFF",
                  }
                : {}
            }
            key={i}
          >
            {d.icon}&nbsp;&nbsp;
            <div>{d.title}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Sidebar;
