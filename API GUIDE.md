
This is my backend — I just uploaded it to Vercel. Don’t create any new API files; fix this in my frontend instead. If there’s a problem with my API, just let me know so I can manually fix it.
import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

/**
 * @swagger
 * /api/ai/builder:
 *   post:
 *     summary: Generate compost building instructions using AI
 *     description: Takes a target plant and available materials to generate AI-powered compost building instructions by communicating with an external ngrok server.
 *     tags:
 *       - Artificial Intelligence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plant
 *               - available_materials
 *             properties:
 *               plant:
 *                 type: string
 *                 description: The target plant for which compost is being built
 *                 example: "Tomato Plant"
 *               available_materials:
 *                 type: array
 *                 description: Array of available materials for compost building
 *                 items:
 *                   type: string
 *                 example: ["Vegetable Scraps", "Coffee Grounds", "Dry Leaves"]
 *               userId:
 *                 type: string
 *                 description: Optional unique identifier of the user requesting compost instructions
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Successfully generated compost building instructions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 compostData:
 *                   type: object
 *                   description: The AI-generated compost building data and instructions
 *       400:
 *         description: Bad request - invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *             examples:
 *               invalid_plant:
 *                 value:
 *                   success: false
 *                   message: "Plant must be a non-empty string"
 *               invalid_materials:
 *                 value:
 *                   success: false
 *                   message: "Available materials must be an array"
 *       500:
 *         description: Internal server error - ngrok server issues or processing errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Contact Arjay to turn on ngrok server in his phone"
 *                 error:
 *                   type: string
 *                   description: Additional error details
 *             examples:
 *               ngrok_error:
 *                 value:
 *                   success: false
 *                   message: "Contact Arjay to turn on ngrok server in his phone"
 *                   error: "Database error message"
 *               server_error:
 *                 value:
 *                   success: false
 *                   message: "Send a direct message to Arjay to turn on ngrok server in his phone"
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { plant, available_materials, userId } = body;

        console.log('Available materials:', available_materials);

        // Validate required fields
        if (!plant || typeof plant !== 'string' || !plant.trim()) {
            return NextResponse.json({
                success: false,
                message: "Plant must be a non-empty string"
            }, { status: 400 });
        }

        //Check if avaiable_materials is an array
        if (!Array.isArray(available_materials)) {
            return NextResponse.json({
                success: false,
                message: "Available materials must be an array"
            }, { status: 400 });
        }

        // Read ngrok from database where ngrok_id = .env NGROK_ID
        const { data: ngrokData, error: ngrokError } = await supabase
        .from('ngrok')
        .select('ngrok_url')
        .eq('ngrok_id', process.env.NGROK_ID)
        .single();

        // Check if ngrok data is found
        if (ngrokError || !ngrokData) {
            console.error('Error fetching ngrok data:', ngrokError);
            return NextResponse.json({
                success: false,
                message: "Contact Arjay to turn on ngrok server in his phone",
                error: ngrokError.message
            }, { status: 500 });
        }

        console.log('Ngrok URL:', ngrokData.ngrok_url);

        // Verify if ngrok server is running
        let ngrokUrl = `${ngrokData.ngrok_url}/api/status`;
        const getNgrokStatus = await fetch(ngrokUrl, {
            method: 'GET',
        });

        // Check method and status of ngrok server
        if (!getNgrokStatus.ok) {
            console.error('Error fetching ngrok status:', getNgrokStatus.statusText);
            return NextResponse.json({
                success: false,
                message: "Send a direct message to Arjay to turn on ngrok server in his phone"
            }, { status: 500 });
        }

        // Construct the ngrok URL and pass image to POST
        ngrokUrl = `${ngrokData.ngrok_url}/api/builder`;

        const compostResponse = await fetch(ngrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plant: plant,
                available_materials: available_materials,
                userId: userId
            })
        });
        
        const compostData = await compostResponse.json();

        if (!compostResponse.ok) {
            return NextResponse.json({
                success: false,
                message: compostData
            }, { status: 500 });
        }

        return NextResponse.json({ success: true, compostData });
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred while processing the request" }, { status: 500 });
    }
}


import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

interface DiagnosticsRequest {
  image: string;
  userId: string;
}

interface NutrientSuggestion {
  nutrientNeeds: string;
  compostSuggestions: string;
}

interface DiagnosticsResponse {
  success: boolean;
  message?: string;
  data?: any;
  diagnosis?: NutrientSuggestion;
  error?: string;
}

/**
 * @swagger
 * /api/ai/diagnostics:
 *   post:
 *     summary: Analyze plant health from image
 *     description: Upload a plant image for AI-powered health diagnosis and nutrient recommendations
 *     tags:
 *       - Artificial Intelligence
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - userId
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 encoded image of the plant to diagnose
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
 *               userId:
 *                 type: string
 *                 description: Unique identifier of the user requesting the diagnosis
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Plant diagnosis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *                 data:
 *                   type: object
 *                   description: Plant identification and health data
 *                   properties:
 *                     prediction:
 *                       type: string
 *                       description: Plant species identification
 *                       example: "Tomato Plant"
 *                     confidence:
 *                       type: number
 *                       description: Confidence score of identification
 *                       example: 0.95
 *                 diagnosis:
 *                   type: object
 *                   description: AI-generated nutrient and care recommendations
 *                   properties:
 *                     nutrientNeeds:
 *                       type: string
 *                       description: Recommended nutrients for the plant
 *                       example: "nitrogen, phosphorus, potassium"
 *                     compostSuggestions:
 *                       type: string
 *                       description: Recommended compost or soil amendments
 *                       example: "organic compost, bone meal, fish emulsion"
 *       400:
 *         description: Bad request - missing or invalid image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Image is required"
 *                 error:
 *                   type: string
 *                   example: "Image data is required and must be a valid base64 string"
 *       500:
 *         description: Internal server error or external service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Contact Arjay to turn on ngrok server in his phone"
 *                 error:
 *                   type: string
 *                   example: "An error occurred while fetching diagnostics"
 */
export async function POST(request: NextRequest) {
    try{
        const body: DiagnosticsRequest = await request.json();

        // Validate required fields
        if (!body.image || typeof body.image !== 'string' || body.image.trim().length === 0) {
            const errorResponse: DiagnosticsResponse = {
                success: false,
                message: "Image is required",
                error: "Image data is required and must be a valid base64 string"
            };
            return NextResponse.json(errorResponse, { status: 400 });
        }

        let image = body.image;
        let userId = body.userId;

        // Read ngrok from database where ngrok_id = .env NGROK_ID
        const { data: ngrokData, error: ngrokError } = await supabase
            .from('ngrok')
            .select('ngrok_url')
            .eq('ngrok_id', process.env.NGROK_ID)
            .single();

        // Check if ngrok data is found
        if (ngrokError || !ngrokData) {
            console.error('Error fetching ngrok data:', ngrokError);
            return NextResponse.json({
                success: false,
                message: "Contact Arjay to turn on ngrok server in his phone",
                error: ngrokError.message
            }, { status: 500 });
        }

        console.log('Ngrok URL:', ngrokData.ngrok_url);

        // Verify if ngrok server is running
        let ngrokUrl = `${ngrokData.ngrok_url}/api/status`;
        const getNgrokStatus = await fetch(ngrokUrl, {
            method: 'GET',
        });

        // Check method and status of ngrok server
        if (!getNgrokStatus.ok) {
            console.error('Error fetching ngrok status:', getNgrokStatus.statusText);
            return NextResponse.json({
                success: false,
                message: "Send a direct message to Arjay to turn on ngrok server in his phone"
            }, { status: 500 });
        }

        // Construct the ngrok URL and pass image to POST
        ngrokUrl = `${ngrokData.ngrok_url}/api/plant`;

        const response = await fetch(ngrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: image,
                userId: userId
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error uploading image to ngrok:', errorText);
            return NextResponse.json({
                success: false,
                message: "Failed to upload image to Analytics Server",
                error: errorText
            }, { status: response.status });
        }

        const ngrokResponse = await response.json();

        console.log('Ngrok response:', ngrokResponse);
        
        // Construct the ngrok URL and pass image to POST
        ngrokUrl = `${ngrokData.ngrok_url}/api/builder`;

        const compostResponse = await fetch(ngrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plant: ngrokResponse.prediction,
                available_materials: ["N/A"]
            })
        });

        const compostData = await compostResponse.json();

        // Use the combined_analysis final_mix directly and format it as a string
        const nutrientNeeds = Object.entries(compostData.combined_analysis.final_mix)
            .map(([mineral, value]) => `${mineral.charAt(0).toUpperCase() + mineral.slice(1)}: ${(value as number).toFixed(1)}`)
            .join(', ');

        const compostSuggestions = compostData.recommendations.map((item: any) => item.compostable).join(", ");

        const diagnosisObj = {
            nutrientNeeds: nutrientNeeds,
            compostSuggestions: compostSuggestions
        };

        const successResponse: DiagnosticsResponse = {
            success: true,
            message: "Image uploaded successfully",
            data: ngrokResponse,
            diagnosis: diagnosisObj
        };

        console.log('Success response:', successResponse);

        return NextResponse.json(successResponse);
    }
    catch (error) {
        console.error('Error fetching diagnostics:', error);

        const errorResponse: DiagnosticsResponse = {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred while fetching diagnostics"
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }   
}