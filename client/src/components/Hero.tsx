import { Box, Container, Image, Stack, Text } from "@chakra-ui/react";
import { Button } from "@mui/material";
import heroImage from "../assets/hero_img.jpeg";
import React from "react";

export default function Hero() {
    return (
        <React.Fragment>
            <Box height="30em" overflow="hidden" position="relative">
                <Image
                    src={heroImage}
                    height="30em"
                    width="100%"
                    objectFit="cover"
                />
                {/* The following box is an overlay for the hero image */}
                <Box
                    height="100%"
                    width="100%"
                    top="0px"
                    bottom="0px"
                    position="absolute"
                    bg="rgba(0, 0, 0, 0.3)"
                    padding="1.5em 2.5em"
                >
                    <Stack
                        spacing={9}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                    >
                        <Text as="b" fontSize="40px" color="#fafafa">
                            Discover your next rental opportunity.
                        </Text>
                        <Text fontSize="32px" color="#fafafa">
                            Search nearby apartments for rent and sublet!
                        </Text>
                        <Stack direction="row" spacing="3em">
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: "uppercase",
                                }}
                            >
                                Rent
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: "uppercase",
                                }}
                            >
                                Sublet
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </React.Fragment>
    );
}
