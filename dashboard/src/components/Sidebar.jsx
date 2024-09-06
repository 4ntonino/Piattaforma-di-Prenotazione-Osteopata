


import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, VStack, Icon, Tooltip, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerBody, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaHome, FaUserMd, FaEnvelope, FaUserPlus, FaUserCog, FaSignOutAlt, FaBars } from "react-icons/fa";

const MotionBox = motion(Box);

const MenuItem = ({ icon, label, to, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Tooltip label={label} placement="right" hasArrow>
      <MotionBox
        as={Link}
        to={to}
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="60px"
        h="60px"
        borderRadius="md"
        bg={isActive ? "blue.500" : "transparent"}
        color={isActive ? "white" : "gray.500"}
        _hover={{ bg: "blue.100", color: "blue.500" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <Icon as={icon} boxSize="24px" />
      </MotionBox>
    </Tooltip>
  );
};

const Sidebar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/admin/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  if (!isAuthenticated) return null;

  const menuItems = [
    { icon: FaHome, label: "Home", to: "/" },
    { icon: FaUserMd, label: "Dottori", to: "/doctors" },
    { icon: FaEnvelope, label: "Messaggi", to: "/messages" },
    { icon: FaUserPlus, label: "Aggiungi Dottore", to: "/doctor/addnew" },
    { icon: FaUserCog, label: "Aggiungi Admin", to: "/admin/addnew" },
    { icon: FaSignOutAlt, label: "Logout", onClick: handleLogout },
  ];

  return (
    <>
      <IconButton
        icon={<FaBars />}
        position="fixed"
        top={4}
        left={4}
        zIndex={2}
        onClick={onOpen}
        display={{ base: "flex", md: "none" }}
      />

      <Box
        as="nav"
        pos="fixed"
        left={0}
        p={5}
        w="80px"
        top={0}
        h="100vh"
        bg="white"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        display={{ base: "none", md: "block" }}
      >
        <VStack spacing={6}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </VStack>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {menuItems.map((item, index) => (
                <Box
                  key={index}
                  as={item.to ? Link : "button"}
                  to={item.to}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    onClose();
                  }}
                  py={4}
                  px={6}
                  _hover={{ bg: "blue.50" }}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={item.icon} mr={3} />
                  {item.label}
                </Box>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;